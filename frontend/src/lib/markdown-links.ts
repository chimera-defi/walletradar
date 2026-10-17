import { brand } from './brand';

/** Slugs of the root *.md files the site renders under /docs/<slug>. Keep in sync with DOCUMENT_CONFIG in markdown.ts. */
const RENDERED_DOC_SLUGS = new Set([
  'software-wallets',
  'hardware-wallets',
  'crypto-cards',
  'ramps',
  'qr-payments',
  'readme',
  'contributing',
  'about',
  'data-sources',
  'changelog',
]);

/** Lowercase and drop everything but letters and digits, so "#-a--b" and "#a-b" compare equal. */
function anchorKey(value: string): string {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    /* keep raw value */
  }
  return decoded.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

export function headingToId(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*~]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

/** Map normalised heading text to the heading id rehype-slug generates, so loosely written #anchors still resolve. */
export function buildAnchorMap(markdown: string): Map<string, string> {
  const map = new Map<string, string>();
  const counts = new Map<string, number>();
  const body = markdown.replace(/^(```|~~~)[\s\S]*?^\1/gm, (block) => block.replace(/[^\n]/g, ' '));
  for (const match of body.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const base = headingToId(match[1]);
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    const id = seen === 0 ? base : `${base}-${seen}`;
    const key = anchorKey(base);
    if (key && !map.has(key)) map.set(key, id);
  }
  return map;
}

type ResolvedLink =
  | { kind: 'hash'; href: string }
  | { kind: 'internal'; href: string }
  | { kind: 'external'; href: string };

/** Decide how a markdown link should render. Relative repo paths become site routes or GitHub links. */
export function resolveMarkdownLink(href: string, anchors?: Map<string, string>): ResolvedLink {
  if (/^https?:\/\//i.test(href)) return { kind: 'external', href };
  if (/^(mailto:|tel:)/i.test(href)) return { kind: 'external', href };

  if (href.startsWith('#')) {
    const frag = href.slice(1);
    return { kind: 'hash', href: `#${anchors?.get(anchorKey(frag)) ?? frag}` };
  }

  const [pathPartRaw, hash] = href.split('#');
  const suffix = hash ? `#${hash}` : '';
  const pathPart = pathPartRaw.replace(/^(\.\.?\/)+/, '');

  if (pathPart.startsWith('/')) return { kind: 'internal', href };

  if (pathPart.startsWith('frontend/public/')) {
    return { kind: 'internal', href: `/${pathPart.slice('frontend/public/'.length)}` };
  }

  const articleMatch = pathPart.match(/^articles\/([^/]+)\.md$/i);
  if (articleMatch) return { kind: 'internal', href: `/articles/${articleMatch[1]}/${suffix}` };

  if (/\.md$/i.test(pathPart) && !pathPart.includes('/')) {
    const slug = pathPart.replace(/\.md$/i, '').toLowerCase().replace(/_/g, '-');
    if (slug === 'glossary') return { kind: 'internal', href: `/glossary/${suffix}` };
    // X_DETAILS.md is rendered inside the category page, so its anchors live on /docs/<cat>/.
    const detailsOf = slug.match(/^(.+)-details$/)?.[1];
    if (detailsOf && RENDERED_DOC_SLUGS.has(detailsOf)) {
      return { kind: 'internal', href: `/docs/${detailsOf}/${suffix || '#details'}` };
    }
    if (RENDERED_DOC_SLUGS.has(slug)) return { kind: 'internal', href: `/docs/${slug}${suffix}` };
  }

  // Anything else is a repo file (scripts, LICENSE, unrendered docs): link to GitHub.
  return { kind: 'external', href: `${brand.githubUrl}/blob/main/${pathPart}${suffix}` };
}
