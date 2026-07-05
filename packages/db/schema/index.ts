import {
  pgTable,
  text,
  uuid,
  integer,
  varchar,
  time,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull(),
  profilePic: text(),
  password: varchar({ length: 500 }),
  lastLoggedIn: time("last_logged_in"),
  loginCount: integer("login_count").default(1),
});
