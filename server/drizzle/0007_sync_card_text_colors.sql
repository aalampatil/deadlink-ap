ALTER TABLE "social_cards" ADD COLUMN IF NOT EXISTS "bio_color" varchar(20) DEFAULT '#111111' NOT NULL;
ALTER TABLE "social_cards" ADD COLUMN IF NOT EXISTS "display_name_color" varchar(20) DEFAULT '#000000' NOT NULL;
