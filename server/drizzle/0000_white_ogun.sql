CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"display_title" varchar(255) DEFAULT '',
	"mapped_url" varchar(2048),
	"mapped_on" timestamp with time zone,
	"public_url" varchar(2048) NOT NULL,
	"manage_url" varchar(2048) NOT NULL,
	"owner_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" varchar(10) GENERATED ALWAYS AS (CASE 
          WHEN mapped_url IS NOT NULL THEN 'ready' 
          ELSE 'pending' 
        END) STORED,
	CONSTRAINT "links_slug_unique" UNIQUE("slug")
);
