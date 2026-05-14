# GDPR runbook — manual operations

Until Kritano's GDPR admin tooling ships (see `kritano-gdpr-spec.md`), data-subject requests are handled by running the SQL below on the production DB. All three operations satisfy the 30-day SLA documented in the privacy notice provided you action them within a week of receipt.

**Connecting:** SSH to the VPS, then `psql "$DATABASE_URL"` from inside `/var/www/chrisgarlick`. The env var is already in `.env`.

---

## 1. Subject access request

Someone emails `privacy@chrisgarlick.com` asking what data we hold for them. Reply within 30 days with a JSON export of everything below.

```sql
-- All audit submissions for this email
SELECT
  audit_ref, status, submitted_at, sent_at, deleted_at, deletion_reason,
  privacy_notice_version, data
FROM audit_submissions
WHERE email = :email_input;

-- Every outbound email we've sent to this address
SELECT id, audit_submission_id, subject, template, sent_at, resend_message_id
FROM outbound_email_log
WHERE to_email = :email_input
ORDER BY sent_at DESC;

-- Any contact-form or diagnostic submissions tied to the same email
-- (data is jsonb; the email may live under different keys per form)
SELECT
  f.slug AS form_slug,
  s.data,
  s.created_at,
  s.ip_address
FROM form_submissions s
JOIN forms f ON s.form_id = f.id
WHERE
  s.data->>'email' = :email_input
  OR s.data->>'Email' = :email_input
ORDER BY s.created_at DESC;
```

Bundle the three result sets into a single JSON file. Reply by email with the export attached and a short note describing what we hold, why, the retention period, and how to exercise other rights (deletion, rectification).

---

## 2. Right to erasure

Someone explicitly asks to be deleted (via email, or via the `/data/delete?t=<token>` link if their link still works). For most cases the self-serve link is enough — this manual path is for cases where the link's been lost or the request came in another channel.

```sql
-- Lookup first — confirm what we're about to delete
SELECT id, audit_ref, status, pdf_path, sent_at, deleted_at
FROM audit_submissions WHERE email = :email_input;

-- Note any pdf_path values returned above. After running the DELETE below,
-- remove each PDF file from disk:
--   rm /var/www/chrisgarlick/storage/audits/<audit_ref>.pdf

-- Hard delete + write to the audit_deletion_log table that Kritano will
-- create once its GDPR feature ships. Until then, log to a notes file
-- (storage/gdpr-deletions.log) instead.

BEGIN;

  -- Capture metadata before delete, for the audit trail
  SELECT
    audit_ref,
    encode(sha256(email::bytea), 'hex') AS email_hash,
    submitted_at
  FROM audit_submissions
  WHERE email = :email_input;
  -- → copy this output into storage/gdpr-deletions.log with a timestamp and reason

  -- Delete audit submissions
  DELETE FROM audit_submissions WHERE email = :email_input;

  -- Delete outbound email log entries for this address
  DELETE FROM outbound_email_log WHERE to_email = :email_input;

  -- Delete form_submissions where this email appears in the jsonb data
  DELETE FROM form_submissions
  WHERE data->>'email' = :email_input
     OR data->>'Email' = :email_input;

COMMIT;
```

After committing, reply to the subject confirming completion (within 30 days of their original request).

If anonymisation is preferred over hard delete (e.g. you want to retain the submission for unit-economics reporting but remove PII), substitute the `DELETE FROM audit_submissions` with:

```sql
UPDATE audit_submissions
SET
  email = 'redacted@gdpr.local',
  data = '{}'::jsonb,
  ip_address = NULL,
  user_agent = NULL,
  pdf_path = NULL,
  deleted_at = now(),
  deletion_reason = 'subject requested erasure ' || :date_input
WHERE email = :email_input;
```

---

## 3. Retention sweep (run quarterly)

Until Kritano's GDPR feature ships its retention sweeper, purge old submissions by hand. Run once per quarter; aligns with the retention policy in the privacy notice (90 days for abandoned, 24 months for sent-no-engagement, 7 years for converted-to-client).

```sql
-- 90-day rule: unsent submissions older than 90 days get purged.
-- "Unsent" = status is anything except 'sent' (i.e. abandoned during workflow).
DELETE FROM audit_submissions
WHERE status != 'sent'
  AND submitted_at < now() - INTERVAL '90 days';

-- 24-month rule: sent submissions older than 24 months with no follow-up.
-- If you've converted them to a client, move them to a long-term archive first.
DELETE FROM audit_submissions
WHERE status = 'sent'
  AND sent_at < now() - INTERVAL '24 months';

-- Clean up orphaned outbound-email-log entries (where audit_submission_id is null
-- because the submission was deleted)
DELETE FROM outbound_email_log
WHERE audit_submission_id IS NULL
  AND sent_at < now() - INTERVAL '24 months';

-- Show what's left
SELECT status, count(*), MIN(submitted_at) AS oldest, MAX(submitted_at) AS newest
FROM audit_submissions
GROUP BY status;
```

After running, also `rm` any orphaned PDF files in `storage/audits/`:

```bash
# List PDFs that no longer have a matching audit_submissions row
cd /var/www/chrisgarlick/storage/audits
for f in *.pdf; do
  ref="${f%.pdf}"
  exists=$(psql "$DATABASE_URL" -tAc "SELECT 1 FROM audit_submissions WHERE audit_ref = '$ref' LIMIT 1")
  [ -z "$exists" ] && echo "rm $f"
done
# Then run the rm commands manually after eyeballing the list
```

---

## Mint a test self-serve delete link (dev only)

For testing `/data/delete` before the audit-delivery email is wired up (Phase C):

```bash
# Requires ADMIN_SECRET env var to be set in .env
curl -H "Authorization: Bearer $ADMIN_SECRET" \
  "https://chrisgarlick.com/api/audit/mint-delete-token?id=<submission-uuid>"
```

Returns `{ token, url }`. Visit the URL to test the deletion flow.

---

## When Kritano's GDPR admin ships

This entire runbook becomes obsolete. The /admin/gdpr lookup tool will handle all three operations from one page with audit-trail logging built in. Migrate as soon as it lands, archive this file.

*Last updated: 14 May 2026 (chrisgarlick.com Phase A4)*
