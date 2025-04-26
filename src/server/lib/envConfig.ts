import { envSchema } from "@/schemas/envSchema"

export const { PORT } = envSchema.parse(process.env)
