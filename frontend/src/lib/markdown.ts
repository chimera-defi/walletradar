import { headingToId } from './markdown-links';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { brand } from './brand';

// Repo root (one level up from frontend). Document keys below are paths relative to it.
const CONTENT_DIR = path.join(process.cwd(), '..');

export interface MarkdownDocument {
  slug: string;
  title: string;
  description: string;
  content: string;
  lastUpdated?: string;
  category: 'comparison' | 'research' | 'guide' | 'other';
  order: number;
}

// Define the markdown files we want to process and their metadata
const DOCUMENT_CONFIG: Record<string, Omit<MarkdownDocument, 'slug' | 'content'>> = {
  'data/tables/SOFTWARE_WALLETS.md': {
    title: 'Software Wallet Comparison',
    description: 'Developer-focused comparison of software wallets with scoring, security audits, and recommendations',
    category: 'comparison',
    order: 1,
  },
  'data/tables/HARDWARE_WALLETS.md': {
    title: 'Hardware Wallet Comparison',
    description: 'Cold storage comparison of hardware wallets with security features and GitHub metrics',
    category: 'comparison',
    order: 2,
  },
  'data/tables/CRYPTO_CARDS.md': {
    title: 'Crypto Credit Card Comparison',
    description: 'Comparison of crypto credit cards.',
    category: 'comparison',
    order: 3,
  },
  'data/tables/RAMPS.md': {
    title: 'Crypto On/Off-Ramp Comparison',
    description: 'Comparison of crypto on-ramp and off-ramp providers with fees, coverage, and developer experience.',
    category: 'comparison',
    order: 4,
  },
  'data/tables/QR_PAYMENTS.md': {
    title: 'QR Payment Crypto Providers',
    description: 'Comparison of QR code crypto payment providers for merchants with fees, coverage, and integration options',
    category: 'comparison',
    order: 5,
  },
  'README.md': {
    title: 'Overview',
    description: 'Wallet research documentation hub - quick recommendations and data sources',
    category: 'guide',
    order: 0,
  },
  'CONTRIBUTING.md': {
    title: 'Contributing Guide',
    description: 'How to add new wallets and contribute to the comparison',
    category: 'guide',
    order: 5,
  },
  'docs/site/ABOUT.md': {
    title: `About ${brand.displayName}`,
    description: `Educational research platform for comparing crypto access products. Independent, developer-focused, and open source.`,
    category: 'guide',
    order: 6,
  },
  'docs/site/DATA_SOURCES.md': {
    title: 'Data Sources & External Links',
    description: 'Transparency about external links, data verification, and link tracking. Why we link to wallet sites and how to verify information.',
    category: 'guide',
    order: 6.5,
  },
  'CHANGELOG.md': {
    title: 'Changelog',
    description: 'Track significant changes to wallet statuses, recommendations, and documentation structure',
    category: 'guide',
    order: 7,
  },
};

function getMarkdownFiles(): string[] {
  return Object.keys(DOCUMENT_CONFIG);
}

export function getAllDocuments(): MarkdownDocument[] {
  const files = getMarkdownFiles();
  
  const documents = files
    .map((filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { content } = matter(fileContent);
      
      const config = DOCUMENT_CONFIG[filename];
      const slug = path.basename(filename, '.md').toLowerCase().replace(/_/g, '-');
      
      // Extract last updated from content if present
      const lastUpdatedMatch = content.match(/Last [Uu]pdated:?\s*([^\n\|]+)/);
      const lastUpdatedRaw = lastUpdatedMatch 
        ? lastUpdatedMatch[1].replace(/^\*+\s*/, '').replace(/\*+$/, '').trim() // Strip markdown bold/italic
        : undefined;
      
      // Extract just the date portion (e.g., "December 16, 2025" or "December 2025")
      // This handles formats like "December 16, 2025. Full validation..." or just "December 2025"
      const dateOnlyMatch = lastUpdatedRaw?.match(/^((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:\d{1,2},?\s+)?\d{4})/i);
      const lastUpdated = dateOnlyMatch ? dateOnlyMatch[1] : lastUpdatedRaw;
      
      return {
        slug,
        content,
        lastUpdated,
        ...config,
      } as MarkdownDocument;
    })
    .filter((doc): doc is MarkdownDocument => doc !== null)
    .sort((a, b) => a.order - b.order);
  
  return documents;
}

export function getDocumentBySlug(slug: string): MarkdownDocument | null {
  const documents = getAllDocuments();
  return documents.find((doc) => doc.slug === slug) || null;
}

// The narrative DETAILS doc of each category is rendered inside the category page (/docs/<slug>/#details).
const DETAILS_FILES: Record<string, string> = {
  'software-wallets': 'data/tables/SOFTWARE_WALLETS_DETAILS.md',
  'hardware-wallets': 'data/tables/HARDWARE_WALLETS_DETAILS.md',
  'crypto-cards': 'data/tables/CRYPTO_CARDS_DETAILS.md',
  'ramps': 'data/tables/RAMPS_DETAILS.md',
  'qr-payments': 'data/tables/QR_PAYMENTS_DETAILS.md',
};

function readContent(filename: string): string | null {
  const filePath = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return matter(fs.readFileSync(filePath, 'utf-8')).content;
}

/** Markdown body of a category's DETAILS doc, or null when the category has none. */
export function getDetailsDocument(slug: string): string | null {
  const filename = DETAILS_FILES[slug];
  return filename ? readContent(filename) : null;
}

/** The glossary is served at /glossary/ only, so it is not part of DOCUMENT_CONFIG. */
export function getGlossaryDocument(): MarkdownDocument | null {
  const content = readContent('docs/site/GLOSSARY.md');
  if (content === null) return null;
  return {
    slug: 'glossary',
    title: 'Glossary',
    description: 'Definitions of key wallet and crypto terms.',
    content,
    category: 'guide',
    order: 6.7,
  };
}

export function getDocumentSlugs(): string[] {
  return getAllDocuments().map((doc) => doc.slug);
}

// Extract table of contents from markdown. Ids must match what rehype-slug
// (github-slugger) puts on the rendered headings, or the "On this page" links break.
export function extractTableOfContents(content: string): { id: string; title: string; level: number }[] {
  const headingRegex = /^(#{1,6})\s+(.+?)\s*#*\s*$/gm;
  const toc: { id: string; title: string; level: number }[] = [];
  const seen = new Map<string, number>();

  // Ignore "# comment" lines inside code fences.
  const body = content.replace(/^(```|~~~)[\s\S]*?^\1/gm, (block) => block.replace(/[^\n]/g, ' '));

  let match;
  while ((match = headingRegex.exec(body)) !== null) {
    const level = match[1].length;
    const title = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links
    const base = headingToId(match[2]);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    if (level <= 3) toc.push({ id: count === 0 ? base : `${base}-${count}`, title, level });
  }

  return toc;
}

// Get statistics from the markdown content
export function getWalletStats(documents: MarkdownDocument[]): {
  softwareWallets: number;
  hardwareWallets: number;
  cryptoCards: number;
  ramps: number;
  lastUpdated: string;
} {
  const softwareDoc = documents.find(d => d.slug === 'software-wallets');
  const hardwareDoc = documents.find(d => d.slug === 'hardware-wallets');
  const cryptoCardDoc = documents.find(d => d.slug === 'crypto-cards');
  const rampsDoc = documents.find(d => d.slug === 'ramps');

  // Count wallets from tables by matching data rows with name + numeric score
  // Pattern: | **Name** | Score | or | [**Name**](url) | Score 🟢 | (handles links, emojis, strikethrough)
  // Software: | **Rabby** | 92 | ✅ |
  const softwareCount = softwareDoc?.content.match(/^\|\s*\*\*[A-Z][^*|]+\*\*\s*\|\s*\d+\s*\|/gm)?.length || 0;
  // Hardware: | **Trezor Safe 5** | 94 | or | ~~**Device**~~ | 50 |
  const hardwareCount = hardwareDoc?.content.match(/^\|\s*(?:~~)?\[?\*\*[A-Z][^*|]+\*\*\]?(?:\([^)]*\))?(?:~~)?\s*\|\s*\d+\s*\|/gm)?.length || 0;
  // Crypto cards: | [**1inch Card**](url) | 70 🟡 | (score followed by optional emoji)
  // Using [^|]* to match any chars (including emoji) before the pipe
  const cryptoCardCount = cryptoCardDoc?.content.match(/^\|\s*(?:~~)?\[?\*\*[A-Z0-9][^*|]+\*\*\]?(?:\([^)]*\))?(?:~~)?\s*\|\s*\d+[^|]*\|/gm)?.length || 0;
  // Ramps: | [**Transak**](url) | 92 🟢 | (score followed by optional emoji)
  const rampsCount = rampsDoc?.content.match(/^\|\s*(?:~~)?\[?\*\*[A-Z][^*|]+\*\*\]?(?:\([^)]*\))?(?:~~)?\s*\|\s*\d+[^|]*\|/gm)?.length || 0;

  const latestUpdate = documents
    .filter(d => d.lastUpdated)
    .map(d => d.lastUpdated!)
    .sort()
    .pop() || 'December 2025';

  return {
    softwareWallets: softwareCount,
    hardwareWallets: hardwareCount,
    cryptoCards: cryptoCardCount,
    ramps: rampsCount,
    lastUpdated: latestUpdate,
  };
}
