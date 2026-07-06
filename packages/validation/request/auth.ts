import z from "zod";

export const createUserBody = z.object({
  name: z.string().min(2),
  email: z.email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password length must be at least 8 charcter.")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Must contain an uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Must contain a lowercaes letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Must contain a number",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "Must contain a symbol",
    }),
});

export type createUserBodyType = z.infer<typeof createUserBody>;

export const userSignIn = z.object({
  email: z.email("Invalid email format").trim(),
  password: z.string().nonempty(),
});

export type userSignInType = z.infer<typeof userSignIn>;
