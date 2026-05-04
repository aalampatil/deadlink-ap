CREATE TABLE "social_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" varchar(255) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"display_name" varchar(120) NOT NULL,
	"bio" varchar(280) DEFAULT '' NOT NULL,
	"avatar_url" varchar(2048) DEFAULT '' NOT NULL,
	"accent_color" varchar(20) DEFAULT '#facc00' NOT NULL,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"public_url" varchar(2048) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "social_cards_owner_id_unique" UNIQUE("owner_id"),
	CONSTRAINT "social_cards_slug_unique" UNIQUE("slug")
);
