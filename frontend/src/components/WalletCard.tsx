import Link from 'next/link';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MarkdownDocument } from '@/lib/markdown';

interface WalletCardProps {
  document: MarkdownDocument;
}

const categoryColors: Record<string, string> = {
  comparison: 'bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/30',
  research: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30',
  guide: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
  other: 'bg-muted text-muted-foreground border border-border',
};

const categoryLabels: Record<string, string> = {
  comparison: 'Comparison',
  research: 'Research',
  guide: 'Guide',
  other: 'Documentation',
};

export function WalletCard({ document }: WalletCardProps) {
  return (
    <Link
      href={`/docs/${document.slug}`}
      className="group block p-6 glass-card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className={cn(
            'text-xs font-medium px-2.5 py-1 rounded-full',
            categoryColors[document.category]
          )}
        >
          {categoryLabels[document.category]}
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
      </div>

      <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-sky-400 transition-colors">
        {document.title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {document.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {document.lastUpdated && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {document.lastUpdated}
          </span>
        )}
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Read more
        </span>
      </div>
    </Link>
  );
}
