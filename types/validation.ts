import { z } from "zod";

export const CVDataSchema = z.object({
  header: z.object({
    links: z.array(z.object({
      label: z.string().optional(),
      url: z.string().optional(),
    })).optional(),
  }).optional(),
  personal: z.object({
    fullName: z.string().max(100).optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
  }).optional(),
  experience: z.array(z.object({
    company: z.string().optional(),
    role: z.string().optional(),
    duration: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  education: z.array(z.object({
    school: z.string().optional(),
    degree: z.string().optional(),
    duration: z.string().optional(),
  })).optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    link: z.string().optional(),
    label: z.string().optional(),
  })).optional(),
  sectionOrder: z.array(z.string()).optional(),
  templateId: z.string().optional(),
});

export type CVDataInput = z.infer<typeof CVDataSchema>;
