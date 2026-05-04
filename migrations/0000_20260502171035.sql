-- System tables
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" varchar(255) NOT NULL UNIQUE,
  "password_hash" varchar(255) NOT NULL,
  "name" varchar(255),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "media" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "filename" varchar(500) NOT NULL,
  "original_filename" varchar(500) NOT NULL,
  "mime_type" varchar(100) NOT NULL,
  "size" integer NOT NULL,
  "width" integer,
  "height" integer,
  "alt" text,
  "url" varchar(2048) NOT NULL,
  "thumbnail_url" varchar(2048),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" varchar(255) NOT NULL UNIQUE,
  "value" jsonb NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
  CREATE TRIGGER "set_updated_at_users"
    BEFORE UPDATE ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER "set_updated_at_media"
    BEFORE UPDATE ON "media"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER "set_updated_at_site_settings"
    BEFORE UPDATE ON "site_settings"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Collection tables
CREATE TABLE IF NOT EXISTS "pages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "status" varchar(20) NOT NULL DEFAULT 'draft',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "published_at" timestamptz,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) UNIQUE,
  "body" jsonb,
  "seo" jsonb
);

DO $$ BEGIN
  CREATE TRIGGER "set_updated_at_pages"
    BEFORE UPDATE ON "pages"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "articles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "status" varchar(20) NOT NULL DEFAULT 'draft',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "published_at" timestamptz,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) UNIQUE,
  "body" jsonb,
  "excerpt" text,
  "featured_image" uuid,
  "seo" jsonb,
  CONSTRAINT "fk_articles_featured_image" FOREIGN KEY ("featured_image") REFERENCES "media" ("id") ON DELETE SET NULL
);

DO $$ BEGIN
  CREATE TRIGGER "set_updated_at_articles"
    BEFORE UPDATE ON "articles"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "case_studies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "status" varchar(20) NOT NULL DEFAULT 'draft',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "published_at" timestamptz,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) UNIQUE,
  "body" jsonb,
  "category" varchar(100),
  "result" varchar(255),
  "summary" text,
  "duration" varchar(255),
  "tier" varchar(100),
  "seo" jsonb
);

DO $$ BEGIN
  CREATE TRIGGER "set_updated_at_case_studies"
    BEFORE UPDATE ON "case_studies"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "proof_metrics" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "status" varchar(20) NOT NULL DEFAULT 'draft',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "published_at" timestamptz,
  "text" varchar(255) NOT NULL,
  "sort_order" numeric
);

DO $$ BEGIN
  CREATE TRIGGER "set_updated_at_proof_metrics"
    BEFORE UPDATE ON "proof_metrics"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
