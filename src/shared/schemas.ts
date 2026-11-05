import { z } from 'zod';

export const ConsultationRequestSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address required'),
  company: z.string().min(1, 'Company name is required'),
  teamSize: z.enum(['1-10', '11-50', '51-200', '201+']).default('1-10'),
  projectScope: z.enum([
    'AI AUTOMATION',
    'AI INTEGRATION',
    'AI AGENT DEVELOPMENT',
    'OTHER',
  ]),
  notes: z.string().max(1000).optional(),
});

export type ConsultationRequest = z.infer<typeof ConsultationRequestSchema>;

export const ContactMessageSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactMessage = z.infer<typeof ContactMessageSchema>;

export const DemoRequestSchema = z.object({
  pipeline: z.enum(['vision', 'insight', 'speed']),
  prompt: z.string().min(3, 'Prompt must be at least 3 characters'),
});

export type DemoRequest = z.infer<typeof DemoRequestSchema>;
