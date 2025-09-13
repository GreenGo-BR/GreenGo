import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    cpf: z.string().min(11).max(14),
    country: z.string().min(1),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, { message: "password.uppercase" })
      .regex(/[0-9]/, { message: "password.number" }),
    confirmPassword: z.string(),
    profileImage: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password.match",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email(),
})

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, { message: "password.uppercase" })
      .regex(/[0-9]/, { message: "password.number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password.match",
    path: ["confirmPassword"],
  })

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>

// Personal info validation schema
export const personalInfoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido").max(14),
  country: z.string().min(1, "País é obrigatório"),
})

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>
