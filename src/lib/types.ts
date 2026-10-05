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

export interface AffiliateMatch {
  provider?: string;
  market?: string;
  asin?: string;
  matchType?: 'EXACT_SKU' | 'EXACT_FAMILY' | 'CATEGORY_REPRESENTATIVE' | 'RELATED_ACCESSORY';
  matchEvidence?: string;
  trackingSource?: string;
  matchedAt?: string;
}

export interface PrimePromo {
  enabled?: boolean;
  ctaText?: string;
  affiliateUrl?: string;
  disclaimer?: string;
}

// MONETIZATION_CARD_V3: fonte de imagem do offer. AMAZON_SITESTRIPE_IMAGE
// deliberadamente de fora do enum -- a conta real do projeto hoje so oferece
// link (texto/completo) no SiteStripe, nao um asset de imagem utilizavel;
// incluir a opcao seria convidar a usa-la antes de existir de verdade.
// AMAZON_HUMAN_SOURCED: foto real do produto. NAO HA, HOJE, mecanismo oficial
// disponivel para obte-la -- o SiteStripe desta conta so oferece link (nao
// imagem) e a Creators API continua NOT_ELIGIBLE_YET (conta sem aprovacao +
// sem 10 vendas qualificadas/30d). Este tipo existe para quando um mecanismo
// oficial do Programa de Associados passar a oferecer imagem (API aprovada ou
// outro recurso futuro da conta) -- a infraestrutura de ingestao (validacao +
// persistencia local + registro de proveniencia) ja esta pronta, so falta a
// fonte oficial. Nunca por scraping automatizado da pagina da Amazon. Diferente
// de EDITORIAL_LOCAL: nao leva o rotulo "Imagem ilustrativa" porque E a foto
// do SKU, nao uma foto generica reaproveitada.
export type ImageSourceType = 'AMAZON_API' | 'AMAZON_HUMAN_SOURCED' | 'EDITORIAL_LOCAL' | 'PLACEHOLDER';

export interface AffiliateOffer {
  affiliateUrl: string;
  ctaText?: string;
  disclaimer?: string;
  match?: AffiliateMatch;
  label?: string;
  // MONETIZATION_CARD_V3 (opcionais, additive): nenhum PageSpec existente
  // precisa preenche-los. Sem imageUrl, o card sempre renderiza o placeholder
  // proprio -- nunca a imagem editorial da pagina como se fosse o SKU.
  imageSourceType?: ImageSourceType;
  imageUrl?: string;
  imageAsin?: string;
  enabled?: boolean;
  // MONETIZATION_CARD_V3.1: uma linha curta e neutra para o card (ex.: "Kit
  // 20V MAX mencionado nesta analise"). Distinto de `disclaimer`, que guarda
  // a nota de auditoria/match mais longa (ex.: por que o matchType foi
  // rebaixado, ou por que dois kits nao sao equivalentes) -- essa nota
  // continua existindo e sendo exibida, só não ocupa mais o lugar da linha
  // de contexto principal do card.
  contextLine?: string;
}

export interface Monetization {
  affiliateUrl?: string;
  ctaText?: string;
  disclaimer?: string;
  match?: AffiliateMatch;
  primePromo?: PrimePromo;
  offers?: AffiliateOffer[];
  // MONETIZATION_CARD_V3.1: mesmos campos opcionais de AffiliateOffer, para o
  // caso de 1 produto so (sem offers[]) poder usa-los tambem.
  imageSourceType?: ImageSourceType;
  imageUrl?: string;
  imageAsin?: string;
  enabled?: boolean;
  contextLine?: string;
  // MONETIZATION_PLACEMENT_V1: valores fechados, nao arbitrarios. Sem este
  // campo, cada page_type usa sua posicao padrao ja decidida no design
  // (model_review/decision_compare/brand_compare: logo apos
  // specs/comparacao). 'after_faq' e a unica posicao alternativa aprovada --
  // nunca grudada no Seasonal Banner, que continua sempre perto do
  // fechamento, depois do Product Card nessa ordem.
  placement?: 'after_specs' | 'after_comparison' | 'after_faq';
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

export interface ContextualLink {
  placement: 'after_specs' | 'after_comparison' | 'after_verdict';
  intro: string;
  anchorText: string;
  href: string;
  outro?: string;
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
  contextualLinks?: ContextualLink[];
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
  heading?: string;
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
  contextualLinks?: ContextualLink[];
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

export interface TaxonomyTable {
  title: string;
  intro?: string;
  columns: {
    class: string;
    mechanism: string;
    interface: string;
    application: string;
    caveat: string;
  };
  rows: Array<{
    class: string;
    mechanism: string;
    interface: string;
    application: string;
    caveat: string;
    evidenceIds: string[];
  }>;
}

export type EditorialFunction =
  | 'WHAT_IS_DIFFERENT' | 'WHY_IT_MATTERS' | 'HOW_TO_DECIDE' | 'LIMITS_OF_COMPARISON'
  | 'WHAT_THE_SPECS_MEAN' | 'WHO_IT_FITS' | 'WHAT_TO_CHECK';

export interface EditorialSection {
  editorial_function: EditorialFunction;
  heading: string;
  paragraphs: Array<{ text: string; evidenceIds: string[] }>;
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
  editorialSections?: EditorialSection[];
  taxonomyTable?: TaxonomyTable;
  contextualLinks?: ContextualLink[];
  verdict?: Verdict;
  faq?: FAQ[];
  evidences: Evidence[];
  monetization?: Monetization;
}

// ============================================
// UNION TYPE
// ============================================

export type PageSpec = ModelReviewPageSpec | BrandComparePageSpec | DecisionComparePageSpec;
