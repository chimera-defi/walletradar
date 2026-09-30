/**
 * DeFiLlama API Integration
 * Fetches chain TVL data for wallet chain support context
 */

interface ChainTVL {
  name: string;
  tvl: number;
  chainId: string | null;
  gecko_id: string | null;
  tokenSymbol: string | null;
  cmcId: string | null;
}

export interface ChainData {
  name: string;
  tvl: number;
  tvlFormatted: string;
  chainId: number | null;
  isEVM: boolean;
  rank: number;
}

// Cache for chain data
let cachedChainData: ChainData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Format TVL as human-readable string
 */
function formatTVL(tvl: number): string {
  if (tvl >= 1e12) {
    return `$${(tvl / 1e12).toFixed(2)}T`;
  }
  if (tvl >= 1e9) {
    return `$${(tvl / 1e9).toFixed(2)}B`;
  }
  if (tvl >= 1e6) {
    return `$${(tvl / 1e6).toFixed(2)}M`;
  }
  if (tvl >= 1e3) {
    return `$${(tvl / 1e3).toFixed(2)}K`;
  }
  return `$${tvl.toFixed(2)}`;
}

/**
 * Known EVM chain IDs from DeFiLlama
 */
const EVM_CHAINS = new Set([
  'ethereum',
  'bsc',
  'polygon',
  'arbitrum',
  'optimism',
  'avalanche',
  'fantom',
  'cronos',
  'gnosis',
  'base',
  'linea',
  'scroll',
  'zksync era',
  'polygon zkevm',
  'manta',
  'mantle',
  'blast',
  'mode',
  'metis',
  'kava',
  'celo',
  'moonbeam',
  'moonriver',
  'aurora',
  'harmony',
  'klaytn',
  'evmos',
  'canto',
  'dogechain',
  'fuse',
  'boba',
  'oasis',
  'milkomeda',
  'thundercore',
  'iotex',
  'wanchain',
  'sx',
  'velas',
  'smartbch',
  'palm',
  'nahmii',
]);

/**
 * Fetch all chains with TVL from DeFiLlama
 */
async function fetchChainsTVL(): Promise<ChainData[]> {
  // Return cached data if fresh
  if (cachedChainData && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedChainData;
  }

  try {
    const response = await fetch('https://api.llama.fi/v2/chains', {
      next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
      signal: AbortSignal.timeout(10_000),
    } as RequestInit & { next?: { revalidate?: number } });

    if (!response.ok) {
      throw new Error(`DeFiLlama API error: ${response.status}`);
    }

    const data: ChainTVL[] = await response.json();

    // Sort by TVL and add rank
    const sortedChains = data
      .filter(chain => chain.tvl > 0)
      .sort((a, b) => b.tvl - a.tvl)
      .map((chain, index) => ({
        name: chain.name,
        tvl: chain.tvl,
        tvlFormatted: formatTVL(chain.tvl),
        chainId: chain.chainId ? parseInt(chain.chainId, 10) : null,
        isEVM: EVM_CHAINS.has(chain.name.toLowerCase()),
        rank: index + 1,
      }));

    // Update cache
    cachedChainData = sortedChains;
    cacheTimestamp = Date.now();

    return sortedChains;
  } catch (error) {
    console.error('Failed to fetch DeFiLlama chains:', error);
    // Return cached data even if stale
    if (cachedChainData) {
      return cachedChainData;
    }
    return [];
  }
}

/**
 * Pre-computed chain stats for static generation
 * This can be called at build time
 */
export async function getChainStats(): Promise<{
  totalChains: number;
  evmChains: number;
  totalTVL: string;
  evmTVL: string;
  topChains: { name: string; tvl: string }[];
}> {
  const chains = await fetchChainsTVL();
  const evmChains = chains.filter(chain => chain.isEVM);

  const totalTVL = chains.reduce((sum, chain) => sum + chain.tvl, 0);
  const evmTVL = evmChains.reduce((sum, chain) => sum + chain.tvl, 0);

  return {
    totalChains: chains.length,
    evmChains: evmChains.length,
    totalTVL: formatTVL(totalTVL),
    evmTVL: formatTVL(evmTVL),
    topChains: evmChains.slice(0, 10).map(chain => ({
      name: chain.name,
      tvl: chain.tvlFormatted,
    })),
  };
}
