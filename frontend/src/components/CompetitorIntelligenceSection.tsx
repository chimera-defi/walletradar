import Link from 'next/link';
import { ArrowRight, Clock, Database, Radar } from 'lucide-react';
import type { MarkdownDocument } from '@/lib/markdown';

interface CompetitorIntelligenceSectionProps {
  documents: MarkdownDocument[];
}

const COMPETITOR_INTEL_DOCS = [
  'crypto-cards-tiers',
  'competitor-tracker',
  'affiliate-targets',
] as const;

export function CompetitorIntelligenceSection({ documents }: CompetitorIntelligenceSectionProps) {
  const competitorDocs = COMPETITOR_INTEL_DOCS
    .map((slug) => documents.find((doc) => doc.slug === slug))
    .filter((doc): doc is MarkdownDocument => doc !== undefined);

  if (competitorDocs.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="glass-card p-6 md:p-7">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            <Radar className="h-3.5 w-3.5" />
            Competitor Intelligence
          </div>
          <h2 className="mt-3 text-2xl font-bold text-foreground">
            Competitor Intelligence
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Direct access to competitor watchlist, affiliate-target tracking, and imported card tier data with freshness indicators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitorDocs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group rounded-xl border border-border/70 bg-background/50 p-4 transition-colors hover:border-sky-500/50"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground group-hover:text-sky-300 transition-colors">
                  {doc.title}
                </h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all" />
              </div>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {doc.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {doc.lastUpdated && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/70 px-2.5 py-1 text-xs text-foreground">
                    <Clock className="h-3 w-3" />
                    Last refreshed {doc.lastUpdated}
                  </span>
                )}
                {typeof doc.sourceCount === 'number' && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/70 px-2.5 py-1 text-xs text-foreground">
                    <Database className="h-3 w-3" />
                    {doc.sourceCount} sources
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
