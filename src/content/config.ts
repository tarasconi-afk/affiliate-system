import { defineCollection, z } from 'astro:content';

// ============================================
// EVIDENCE SCHEMA
// ============================================

const evidenceSchema = z.object({
  id: z.string(),
  evidence_type: z.enum(['SPEC', 'DERIVED', 'OBSERVATION', 'MEASUREMENT']),
  claim: z.string(),
  source_name: z.string(),
  source_url: z.string().url().optional(),
  accessed_at: z.string().datetime(),
  notes: z.string().optional(),
  derived_from: z.array(z.string()).optional()
}).refine(data => {
  // DERIVED evidence must have derived_from array
  if (data.evidence_type === 'DERIVED') {
    return data.derived_from && data.derived_from.length > 0;
  }
  return true;
}, {
  message: "DERIVED evidence type requires derived_from array with at least one element"
});

// ============================================
// SHARED SCHEMAS
// ============================================

const breadcrumbSchema = z.object({
  name: z.string(),
  url: z.string().optional()
});

const metadataSchema = z.object({
  title: z.string(),
  metaDescription: z.string(),
  publishedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.string().optional(),
  breadcrumbs: z.array(breadcrumbSchema)
});

const productSchema = z.object({
  name: z.string(),
  brand: z.string(),
  model: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional()
});

const monetizationSchema = z.object({
  affiliateUrl: z.string().url().optional(),
  ctaText: z.string().optional(),
  disclaimer: z.string().optional()
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
  evidenceIds: z.array(z.string()).optional()
});

const verdictSchema = z.object({
  summary: z.string(),
  recommendation: z.string(),
  evidenceIds: z.array(z.string()).optional()
});

// ============================================
// MODEL REVIEW SCHEMA
// ============================================

const specItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  highlight: z.boolean().optional(),
  evidenceIds: z.array(z.string()).min(1, "Spec items must reference at least one evidence")
});

const prosConsItemSchema = z.object({
  text: z.string(),
  evidenceIds: z.array(z.string()).optional()
});

const prosConsSchema = z.object({
  pros: z.array(prosConsItemSchema),
  cons: z.array(prosConsItemSchema)
});

const modelReviewSchema = z.object({
  version: z.literal('1.0'),
  type: z.literal('model_review'),
  slug: z.string(),
  metadata: metadataSchema,
  product: productSchema,
  hero: z.object({
    heading: z.string(),
    subheading: z.string()
  }),
  specs: z.array(specItemSchema),
  prosCons: prosConsSchema.optional(),
  faq: z.array(faqSchema).optional(),
  evidences: z.array(evidenceSchema),
  monetization: monetizationSchema.optional()
});

// ============================================
// BRAND COMPARE SCHEMA
// ============================================

const brandInfoSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
  summary: z.string(),
  evidenceIds: z.array(z.string()).optional()
});

const comparisonDimensionSchema = z.object({
  label: z.string(),
  brand1: z.string(),
  brand2: z.string(),
  winner: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  evidenceIds: z.array(z.string()).min(1, "Comparison dimensions must reference at least one evidence")
});

const brandCompareSchema = z.object({
  version: z.literal('1.0'),
  type: z.literal('brand_compare'),
  slug: z.string(),
  metadata: metadataSchema,
  hero: z.object({
    heading: z.string(),
    subheading: z.string()
  }),
  brands: z.tuple([brandInfoSchema, brandInfoSchema]),
  comparison: z.object({
    dimensions: z.array(comparisonDimensionSchema)
  }),
  verdict: verdictSchema.optional(),
  faq: z.array(faqSchema).optional(),
  evidences: z.array(evidenceSchema),
  monetization: monetizationSchema.optional()
});

// ============================================
// DECISION COMPARE SCHEMA
// ============================================

const decisionOptionSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  evidenceIds: z.array(z.string()).optional()
});

const decisionDimensionSchema = z.object({
  label: z.string(),
  option1: z.string(),
  option2: z.string(),
  winner: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  evidenceIds: z.array(z.string()).min(1, "Decision dimensions must reference at least one evidence")
});

const decisionCompareSchema = z.object({
  version: z.literal('1.0'),
  type: z.literal('decision_compare'),
  slug: z.string(),
  metadata: metadataSchema,
  hero: z.object({
    heading: z.string(),
    subheading: z.string()
  }),
  options: z.tuple([decisionOptionSchema, decisionOptionSchema]),
  comparison: z.object({
    dimensions: z.array(decisionDimensionSchema)
  }),
  verdict: verdictSchema.optional(),
  faq: z.array(faqSchema).optional(),
  evidences: z.array(evidenceSchema),
  monetization: monetizationSchema.optional()
});

// ============================================
// COLLECTION DEFINITION
// ============================================

const pagesCollection = defineCollection({
  type: 'data',
  schema: z.discriminatedUnion('type', [
    modelReviewSchema,
    brandCompareSchema,
    decisionCompareSchema
  ])
});

export const collections = {
  pages: pagesCollection
};
