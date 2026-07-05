CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"profilePic" text,
	"password" varchar(500),
	"last_logged_in" time,
	"login_count" integer DEFAULT 1
);
