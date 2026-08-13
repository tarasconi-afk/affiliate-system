// ============================================
// EVIDENCE SYSTEM
// ============================================

export type EvidenceType = 'SPEC' | 'DERIVED' | 'OBSERVATION' | 'MEASUREMENT';

export interface Evidence {
  id: string;
  evidence_type: EvidenceType;
  claim: string;
  source_name: string;
  source_url?: string;
  accessed_at: string;
  notes?: string;
  derived_from?: string[];
}

// ============================================
// METADATA
// ============================================

export interface Breadcrumb {
  name: string;
  url?: string;
}

export interface PageMetadata {
  title: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt: string;
  author?: string;
  breadcrumbs: Breadcrumb[];
}

// ============================================
// PRODUCT
// ============================================

export interface Product {
  name: string;
  brand: string;
  model?: string;
  category?: string;
  imageUrl?: string;
}

// ============================================
// MONETIZATION (optional)
// ============================================

export interface Monetization {
  affiliateUrl?: string;
  ctaText?: string;
  disclaimer?: string;
}

export interface EditorialMediaItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: number;
  label?: string;
}

export interface EditorialMedia {
  items: EditorialMediaItem[];
  captionLabel?: string;
  caption?: string;
}

export interface EvidencedText {
  text: string;
  evidenceIds: string[];
}

export interface QuickFact {
  label: string;
  value: string;
  evidenceIds: string[];
}

// ============================================
// MODEL REVIEW
// ============================================

export interface SpecItem {
  label: string;
  value: string;
  highlight?: boolean;
  evidenceIds: string[];
}

export interface ProsConsItem {
  text: string;
  evidenceIds?: string[];
}

export interface ProsCons {
  pros: ProsConsItem[];
  cons: ProsConsItem[];
}

export interface FAQ {
  question: string;
  answer: string;
  evidenceIds?: string[];
}

export interface ModelReviewPageSpec {
  version: '1.0';
  type: 'model_review';
  slug: string;
  metadata: PageMetadata;
  product: Product;
  hero: {
    heading: string;
    subheading: string;
    methodNote?: string;
  };
  media: EditorialMedia;
  quickAnswer: EvidencedText;
  quickFacts: QuickFact[];
  specs: SpecItem[];
  prosCons?: ProsCons;
  faq?: FAQ[];
  evidences: Evidence[];
  monetization?: Monetization;
}

// ============================================
// BRAND COMPARE
// ============================================

export interface BrandInfo {
  name: string;
  logo?: string;
  summary: string;
  evidenceIds?: string[];
}

export interface ComparisonDimension {
  label: string;
  brand1: string;
  brand2: string;
  winner?: 0 | 1 | 2;
  evidenceIds: string[];
}

export interface Verdict {
  summary: string;
  recommendation: string;
  evidenceIds?: string[];
}

export interface BrandComparePageSpec {
  version: '1.0';
  type: 'brand_compare';
  slug: string;
  metadata: PageMetadata;
  hero: {
    heading: string;
    subheading: string;
    methodNote?: string;
  };
  media: EditorialMedia;
  brands: [BrandInfo, BrandInfo];
  comparison: {
    dimensions: ComparisonDimension[];
  };
  verdict?: Verdict;
  faq?: FAQ[];
  evidences: Evidence[];
  monetization?: Monetization;
}

// ============================================
// DECISION COMPARE
// ============================================

export interface DecisionOption {
  name: string;
  description: string;
  imageUrl?: string;
  evidenceIds?: string[];
}

export interface DecisionDimension {
  label: string;
  option1: string;
  option2: string;
  winner?: 0 | 1 | 2;
  evidenceIds: string[];
}

export interface DecisionComparePageSpec {
  version: '1.0';
  type: 'decision_compare';
  slug: string;
  metadata: PageMetadata;
  hero: {
    heading: string;
    subheading: string;
    methodNote?: string;
  };
  media: EditorialMedia;
  options: [DecisionOption, DecisionOption];
  comparison: {
    dimensions: DecisionDimension[];
  };
  verdict?: Verdict;
  faq?: FAQ[];
  evidences: Evidence[];
  monetization?: Monetization;
}

// ============================================
// UNION TYPE
// ============================================

export type PageSpec = ModelReviewPageSpec | BrandComparePageSpec | DecisionComparePageSpec;
