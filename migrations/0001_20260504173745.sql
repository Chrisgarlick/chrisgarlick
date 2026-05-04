ALTER TABLE "pages" ADD COLUMN "created_by" uuid;

ALTER TABLE "pages" ADD CONSTRAINT "fk_pages_created_by" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "pages" ADD COLUMN "updated_by" uuid;

ALTER TABLE "pages" ADD CONSTRAINT "fk_pages_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "pages" ADD COLUMN "content" jsonb;

ALTER TABLE "pages" DROP COLUMN IF EXISTS "body";

ALTER TABLE "articles" ADD COLUMN "created_by" uuid;

ALTER TABLE "articles" ADD CONSTRAINT "fk_articles_created_by" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "articles" ADD COLUMN "updated_by" uuid;

ALTER TABLE "articles" ADD CONSTRAINT "fk_articles_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "case_studies" ADD COLUMN "created_by" uuid;

ALTER TABLE "case_studies" ADD CONSTRAINT "fk_case_studies_created_by" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "case_studies" ADD COLUMN "updated_by" uuid;

ALTER TABLE "case_studies" ADD CONSTRAINT "fk_case_studies_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "proof_metrics" ADD COLUMN "created_by" uuid;

ALTER TABLE "proof_metrics" ADD CONSTRAINT "fk_proof_metrics_created_by" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "proof_metrics" ADD COLUMN "updated_by" uuid;

ALTER TABLE "proof_metrics" ADD CONSTRAINT "fk_proof_metrics_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL;