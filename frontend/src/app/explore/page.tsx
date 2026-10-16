import { Suspense } from 'react';
import { Metadata } from 'next';
import {
  parseSoftwareWallets,
  parseHardwareWallets,
  parseCryptoCards,
  parseRamps,
} from '@/lib/wallet-data';
import { getAllDocuments, getWalletStats } from '@/lib/markdown';
import { getChainStats } from '@/lib/defillama';
import { ExploreContent } from './ExploreContent';
import { SocialShare } from '@/components/SocialShare';
import { brand, withBrand } from '@/lib/brand';

const pageTitle = withBrand('Explore & Compare Crypto Products');
const pageDescription = 'Filter, sort, and compare wallets, hardware devices, crypto cards, and ramps side-by-side. Advanced filtering for developer, security, fee, and coverage tradeoffs.';
const pageUrl = `${brand.baseUrl}/explore/`;
const ogImageUrl = `${brand.baseUrl}/og-image.svg?${brand.ogImageVersion}`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'crypto product comparison',
    'wallet filter',
    'compare crypto products',
    'software wallet',
    'hardware wallet',
    'crypto cards',
    'crypto ramps',
    'EVM wallet',
    'MetaMask alternative',
    'product explorer',
    'wallet comparison',
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: 'website',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Explore & Compare Crypto Products - ${brand.displayName}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    creator: brand.twitterHandle,
    site: brand.twitterHandle,
    images: [ogImageUrl],
  },
  alternates: {
    canonical: pageUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ExplorePage() {
  // Fetch wallet data at build time
  const softwareWallets = parseSoftwareWallets();
  const hardwareWallets = parseHardwareWallets();
  const cryptoCards = parseCryptoCards();
  const ramps = parseRamps();

  const docs = getAllDocuments();
  const walletStats = getWalletStats(docs);

  // Fetch chain stats from DeFiLlama
  let chainStats = null;
  try {
    chainStats = await getChainStats();
  } catch (error) {
    console.error('Failed to fetch chain stats:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Explore &amp; Compare</h1>
            <p className="text-muted-foreground">
              Filter, sort, and compare wallets, cards, and ramps side-by-side. Select products to see a detailed comparison.
            </p>
          </div>
          <SocialShare
            url={pageUrl}
            title={pageTitle}
            description={pageDescription}
            size="large"
          />
        </div>
        <div className="mt-4">
          {chainStats ? (
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="px-3 py-1.5 bg-card/70 border border-border rounded-lg">
                <span className="text-muted-foreground">Data Updated:</span>{' '}
                <span className="font-semibold text-foreground">{walletStats.lastUpdated}</span>
              </div>
              <div className="px-3 py-1.5 bg-card/70 border border-border rounded-lg">
                <span className="text-muted-foreground">Total EVM Chains:</span>{' '}
                <span className="font-semibold text-foreground">{chainStats.evmChains}</span>
              </div>
              <div className="px-3 py-1.5 bg-card/70 border border-border rounded-lg">
                <span className="text-muted-foreground">EVM TVL:</span>{' '}
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {chainStats.evmTVL}
                </span>
              </div>
              <div className="px-3 py-1.5 bg-card/70 border border-border rounded-lg">
                <span className="text-muted-foreground">Top Chain:</span>{' '}
                <span className="font-semibold text-foreground">
                  {chainStats.topChains[0]?.name} ({chainStats.topChains[0]?.tvl})
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Live chain stats are temporarily unavailable. Data last updated: {walletStats.lastUpdated}.
            </p>
          )}
        </div>
      </div>

      <Suspense fallback={<div className="container mx-auto px-4 py-8 text-sm text-muted-foreground" role="status">Loading comparison tables...</div>}>
        <ExploreContent
          softwareWallets={softwareWallets}
          hardwareWallets={hardwareWallets}
          cryptoCards={cryptoCards}
          ramps={ramps}
        />
      </Suspense>
    </div>
  );
}
