ALTER TABLE "links" ADD COLUMN "content_type" "content_type_enum";--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "content_sub_type" varchar(40);--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "file_secure_url" varchar(2048);--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "file_public_id" varchar(2048);--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "link_validity" timestamp DEFAULT now() + interval '30 days';