import { z } from 'zod';
import { categories, contacts, websiteStatuses } from '@/types';
export const searchSchema = z.object({city:z.string().trim().min(2,'Введите город (не менее 2 символов)').max(100).regex(/[\p{L}]/u,'Введите название города'),category:z.enum(categories),limit:z.number().int().min(1).max(100),mode:z.enum(['demo','live'])});
const url = z.union([z.literal(''),z.url().refine(v => /^https?:\/\//i.test(v),'Используйте http или https')]).nullable();
export const leadSchema = z.object({saved:z.boolean().optional(),contactStatus:z.enum(contacts).optional(),websiteStatus:z.enum(websiteStatuses).nullable().optional(),verificationNote:z.string().max(1000).optional(),notes:z.string().max(10000).optional(),instagram:url.optional(),whatsapp:z.string().max(100).nullable().optional(),email:z.union([z.literal(''),z.email()]).nullable().optional(),manualName:z.string().max(200).nullable().optional(),manualPhone:z.string().max(100).nullable().optional(),manualWebsite:url.optional()});
export const templateSchema = z.object({category:z.enum(categories),url:z.union([z.literal(''),z.url().refine(v=>/^https?:\/\//i.test(v))])});
