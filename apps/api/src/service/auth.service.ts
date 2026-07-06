import { usersTable } from "@repo/db/schema";
import type {
  createUserBodyType,
  userSignInType,
} from "@repo/validation/request/auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

export class AuthService {
  static async signupUser(data: createUserBodyType) {
    const hashedPassword = await argon2.hash(data.password);

    return await db
      ?.insert(usersTable)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      });
  }

  static async userExist(email: string) {
    const user = await db
      ?.select({
        id: usersTable.id,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return user == undefined ? null : user[0];
  }

  static async signiInUser(data: userSignInType) {}
}
