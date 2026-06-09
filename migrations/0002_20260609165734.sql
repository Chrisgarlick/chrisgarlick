-- Add layout_json column to resources for the new Typeset JSON-input render path.
-- The column stores the raw JSON document (frontmatter + pages) as text so it
-- can be sent verbatim to the Typeset API in the existing `content` field
-- alongside `input_format: "json"`.
-- Nullable: resources without a layout_json fall back to markdown_body as today.

ALTER TABLE "resources" ADD COLUMN "layout_json" text;
