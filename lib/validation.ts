import { z } from 'zod';
import { isValidShortCode, isValidUrl } from '@/lib/url';

export const emailSchema = z.string().trim().email('Email inválido').max(254);

export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha deve ter no máximo 128 caracteres');

export const authSchema = z.object({
  email: emailSchema.transform((email) => email.toLowerCase()),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema.transform((email) => email.toLowerCase()),
  password: z.string().min(1, 'Senha é obrigatória').max(128, 'Senha deve ter no máximo 128 caracteres'),
});

export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, 'URL original é obrigatória')
    .max(2048, 'URL inválida ou muito longa (máximo 2048 caracteres)')
    .refine(isValidUrl, 'URL inválida. URLs locais e IPs privados não são permitidos.'),
  customCode: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value.toLowerCase() : undefined))
    .refine((value) => !value || isValidShortCode(value).valid, {
      message: 'Código personalizado inválido',
    }),
});

export const createUserLinkSchema = z.object({
  originalUrl: createUrlSchema.shape.originalUrl,
  customAlias: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value.toLowerCase() : undefined))
    .refine((value) => !value || isValidShortCode(value).valid, {
      message: 'Alias personalizado inválido',
    }),
});

export const updateUserLinkSchema = z.object({
  originalUrl: createUrlSchema.shape.originalUrl.optional(),
  customAlias: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => (value ? value.toLowerCase() : null))
    .refine((value) => !value || isValidShortCode(value).valid, {
      message: 'Alias personalizado inválido',
    }),
});

export const marketingLeadSchema = z.object({
  name: z
    .string('Informe seu nome')
    .trim()
    .min(2, 'Informe seu nome')
    .max(120, 'Nome muito longo'),
  email: z
    .string('Informe seu email')
    .trim()
    .email('Email inválido')
    .max(254)
    .transform((email) => email.toLowerCase()),
  company: z
    .string()
    .trim()
    .max(160, 'Empresa muito longa')
    .optional()
    .transform((value) => value || undefined),
  phone: z
    .string()
    .trim()
    .max(40, 'Telefone muito longo')
    .optional()
    .transform((value) => value || undefined),
  interest: z
    .enum(['premium', 'analytics', 'campaigns', 'agency'])
    .default('premium'),
  source: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value || 'home_conversion_band'),
  message: z
    .string()
    .trim()
    .max(500, 'Mensagem muito longa')
    .optional()
    .transform((value) => value || undefined),
});

export function getZodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message || 'Dados inválidos';
}
