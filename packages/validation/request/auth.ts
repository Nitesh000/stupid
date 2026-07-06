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
