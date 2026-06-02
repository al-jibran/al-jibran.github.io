import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kicker: z.string(),
      description: z.string().optional(),
      // Transform string to Date object
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      pubDate: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      readingTime: z.string(),
    }),
});


export const collections = {
  blog,
};