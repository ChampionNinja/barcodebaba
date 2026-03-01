import { z } from 'zod';
import { scanRequestSchema, scanResponseSchema } from './schema';

export const errorSchemas = {
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  })
};

export const api = {
  scan: {
    process: {
      method: 'POST' as const,
      path: '/api/scan' as const,
      input: scanRequestSchema,
      responses: {
        200: scanResponseSchema,
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
