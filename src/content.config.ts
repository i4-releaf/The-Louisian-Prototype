import { defineCollection, z } from "astro:content";

const SECTIONS = [
  "news",
  "feature",
  "sports",
  "sci-tech",
  "editorial",
  "column",
  "cartoon",
  "multimedia",
] as const;

const articles = defineCollection({
  loader: "**/*.md",
  schema: ({ image }) =>
    z.object({
      title: z.string().min(8).max(140),
      dek: z.string().min(20).max(240),
      section: z.enum(SECTIONS),
      authors: z.array(z.string()).min(1).max(6),
      publishedAt: z.coerce.date(),
      tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(8).default([]),
      featured: z.boolean().default(false),
      hero: image().optional(),
      heroAlt: z.string().max(240).optional(),
      heroCaption: z.string().max(240).optional(),
      heroCredit: z.string().max(160).optional(),
      format: z.enum(["standard", "media", "cartoon"]).default("standard"),
      media: z
        .object({
          provider: z.enum(["youtube", "facebook", "spotify", "soundcloud", "other"]),
          url: z.string().url(),
          title: z.string().min(3).max(140),
          poster: image().optional(),
          posterAlt: z.string().max(240).optional(),
          duration: z.string().max(20).optional(),
          transcriptUrl: z.string().url().optional(),
        })
        .optional(),
      gallery: z
        .array(
          z.object({
            image: image(),
            alt: z.string().min(1).max(240),
            caption: z.string().max(240).optional(),
            credit: z.string().max(160),
          })
        )
        .min(1)
        .optional(),
      issue: z.string().optional(),
      corrections: z
        .array(
          z.object({
            date: z.coerce.date(),
            note: z.string().min(10).max(500),
          })
        )
        .default([]),
      contentWarning: z.string().max(200).optional(),
      seoDescription: z.string().max(160).optional(),
      draft: z.boolean().default(false),
      unlisted: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      if (data.hero && (!data.heroAlt || !data.heroCredit)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A hero image requires heroAlt and heroCredit.",
        });
      }
      if (data.format === "media" && !data.media) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A media article requires a media object.",
        });
      }
      if (data.format === "cartoon" && !data.gallery) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A cartoon article requires a gallery.",
        });
      }
      if (data.featured && !data.featuredRank) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A featured article requires featuredRank.",
        });
      }
    }),
});

const issues = defineCollection({
  loader: "**/index.md",
  schema: z.object({
    volume: z.number().int().min(1).max(200),
    issueNumber: z.number().int().min(1).max(12),
    schoolYear: z.string().regex(/^\d{4}–\d{4}$/),
    title: z.string().max(120).optional(),
    publishedAt: z.coerce.date(),
    cover: image(),
    coverAlt: z.string().min(1).max(240),
    pdf: z.string().regex(/^\/issues\/[a-z0-9-]+\.pdf$/),
    heyZineUrl: z.string().url(),
    pageCount: z.number().int().min(1).max(200).optional(),
    description: z.string().max(400).optional(),
    contents: z
      .array(
        z.object({
          title: z.string().max(160),
          page: z.number().int().min(1).optional(),
          article: z.string().optional(),
        })
      )
      .max(60)
      .optional(),
    draft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: "**/*.md",
  schema: z.object({
    name: z.string().min(3).max(80),
    role: z.string().min(3).max(80),
    boardOrder: z.number().int().min(1).max(99).optional(),
    boardGroup: z.enum(["leadership", "editors", "adviser"]).optional(),
    active: z.boolean().default(true),
    bio: z.string().max(400).optional(),
    photo: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: "**/*.md",
  schema: z.object({
    title: z.string().min(3).max(120),
    description: z.string().max(200).optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export type { Articles, Authors, Issues, Pages };
export { articles, issues, authors, pages };