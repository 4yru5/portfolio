import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Every project, post and timeline entry has the same shape (plan §6).

const projects = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      year: z.number(),
      stack: z.array(z.string()),
      tags: z.array(z.enum(['appsec', 'api', 'ai', 'tem', 'automation'])),
      repo: z.string().url().optional(),
      demo: z.string().optional(), // /media/demos/tool.webm
      cover: image().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

const writing = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    external: z.string().url().optional(), // Medium link when hosted elsewhere
  }),
});

const timeline = defineCollection({
  loader: file('./src/content/timeline.json'),
  schema: z.object({
    date: z.string(), // '2026-03'
    kind: z.enum(['role', 'ctf', 'award', 'education']),
    title: z.string(),
    org: z.string().optional(),
    link: z.string().url().optional(),
    highlight: z.boolean().default(false),
  }),
});

export const collections = { projects, writing, timeline };
