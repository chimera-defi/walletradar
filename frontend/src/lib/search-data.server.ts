import { getAllWalletData } from './wallet-data';
import { getAllDocuments, getGlossaryDocument } from './markdown';
import { getAllArticles } from './articles';
import { brandFaqAnswer, brandFaqQuestion } from './brand';
import type { SearchItem } from './search-data';

// FAQ data for search (duplicated from FAQ component to avoid client/server issues)
const faqItems = [
  {
    question: 'What is a crypto wallet?',
    answer: 'A crypto wallet is software or hardware that stores your private keys and lets you send, receive, and manage cryptocurrencies.',
    category: 'basics',
  },
  {
    question: 'How do I connect my wallet to a dApp?',
    answer: 'To connect your wallet to a decentralized application (dApp): Visit the dApp website, Click "Connect Wallet" button, Select your wallet from the list, Approve the connection.',
    category: 'basics',
  },
  {
    question: "What's the difference between a hot wallet and cold wallet?",
    answer: 'Hot wallets are connected to the internet (browser extensions, mobile apps). Cold wallets (hardware wallets) store keys offline, providing maximum security.',
    category: 'basics',
  },
  {
    question: 'What is a seed phrase and why is it important?',
    answer: 'A seed phrase (recovery phrase) is a 12-24 word sequence that can restore your wallet if you lose access. NEVER share it with anyone.',
    category: 'security',
  },
  {
    question: 'How do I know if a wallet is secure?',
    answer: 'Look for: Open source code, Third-party security audits, Active development, Strong track record, Good community reputation.',
    category: 'security',
  },
  {
    question: 'What is transaction simulation and why does it matter?',
    answer: 'Transaction simulation shows you exactly what will happen before you sign a transaction—which tokens will leave/enter your wallet.',
    category: 'security',
  },
  {
    question: 'What are the signs of a wallet scam?',
    answer: 'Red flags include: Requests for your seed phrase, Fake wallet apps, Phishing sites, Unsolicited DMs, "Customer support" asking for private keys.',
    category: 'security',
  },
  {
    question: brandFaqQuestion('What is Wallet Radar?'),
    answer: brandFaqAnswer('Wallet Radar is a developer-focused platform for comparing crypto wallets with evidence-based scoring using GitHub activity, security audits, and developer experience metrics.'),
    category: 'comparison',
  },
  {
    question: brandFaqQuestion('Why does Wallet Radar say "Educational Research & Data Only"?'),
    answer: brandFaqAnswer('Wallet Radar is a research site, not a broker or wallet provider. It does not run login pages, wallet connections, or transaction signing. Data is sourced from public information and should be verified independently.'),
    category: 'comparison',
  },
  {
    question: 'How are wallet scores calculated?',
    answer: 'Scores are generated from the visible comparison-table columns using published category weights for security, developer UX, activity, coverage, fees, custody, and related inputs.',
    category: 'comparison',
  },
  {
    question: "What's the best wallet for developers?",
    answer: 'For EVM development, Rabby remains the strongest daily-driver. For compatibility testing, keep MetaMask in the matrix. For higher-assurance signing, pair software wallets with dedicated hardware.',
    category: 'comparison',
  },
  {
    question: 'What is EIP-7702 and why does it matter?',
    answer: 'EIP-7702 allows regular accounts to temporarily act like smart contract wallets, enabling gas sponsorship, batched transactions, and social recovery.',
    category: 'technical',
  },
  {
    question: "What's the difference between EOA and smart contract wallets?",
    answer: 'EOA wallets are controlled by a private key. Smart contract wallets are programmable, offering multi-sig, spending limits, and social recovery.',
    category: 'technical',
  },
];

/**
 * Generate search data from all content sources
 * This runs at build time via the component's data loading
 */
function generateSearchData(): SearchItem[] {
  const items: SearchItem[] = [];

  // Add wallet data
  const { software, hardware, cards, ramps } = getAllWalletData();

  software.forEach((wallet) => {
    items.push({
      id: `software-${wallet.id}`,
      title: wallet.name,
      description: wallet.bestFor || 'Software wallet',
      content: `${wallet.name} ${wallet.bestFor || ''} software wallet ${wallet.chains.raw || ''} ${wallet.accountTypes?.join(' ') || ''}`.toLowerCase(),
      type: 'wallet',
      category: 'software',
      url: `/wallets/software/${wallet.id}`,
      score: wallet.score,
      tags: ['software', 'wallet', ...(wallet.accountTypes || [])],
    });
  });

  hardware.forEach((wallet) => {
    items.push({
      id: `hardware-${wallet.id}`,
      title: wallet.name,
      description: `Hardware wallet - ${wallet.priceText || 'Price varies'}`,
      content: `${wallet.name} hardware wallet cold storage ${wallet.connectivity?.join(' ') || ''} ${wallet.display || ''}`.toLowerCase(),
      type: 'wallet',
      category: 'hardware',
      url: `/wallets/hardware/${wallet.id}`,
      score: wallet.score,
      tags: ['hardware', 'wallet', 'cold storage'],
    });
  });

  cards.forEach((card) => {
    items.push({
      id: `card-${card.id}`,
      title: card.name,
      description: card.bestFor || `${card.cardType} crypto card`,
      content: `${card.name} ${card.cardType} crypto card ${card.rewards || ''} ${card.region || ''} ${card.bestFor || ''}`.toLowerCase(),
      type: 'wallet',
      category: 'cards',
      url: `/wallets/cards/${card.id}`,
      score: card.score,
      tags: ['card', 'crypto card', card.cardType],
    });
  });

  ramps.forEach((ramp) => {
    items.push({
      id: `ramp-${ramp.id}`,
      title: ramp.name,
      description: ramp.bestFor || `${ramp.rampType} service`,
      content: `${ramp.name} ${ramp.rampType} on-ramp off-ramp ${ramp.coverage || ''} ${ramp.bestFor || ''}`.toLowerCase(),
      type: 'wallet',
      category: 'ramps',
      url: `/wallets/ramps/${ramp.id}`,
      score: ramp.score,
      tags: ['ramp', ramp.rampType],
    });
  });

  // Add documentation
  const documents = [...getAllDocuments()];
  const glossary = getGlossaryDocument();
  if (glossary) documents.push(glossary);
  documents.forEach((doc) => {
    items.push({
      id: `doc-${doc.slug}`,
      title: doc.title,
      description: doc.description,
      content: `${doc.title} ${doc.description} ${doc.content.slice(0, 500)}`.toLowerCase(),
      type: 'doc',
      category: doc.category,
      url: doc.slug === 'glossary' ? '/glossary' : `/docs/${doc.slug}`,
      tags: [doc.category, 'documentation'],
    });
  });

  // Add articles
  const articles = getAllArticles();
  articles.forEach((article) => {
    items.push({
      id: `article-${article.slug}`,
      title: article.title,
      description: article.description,
      content: `${article.title} ${article.description} ${article.content.slice(0, 500)}`.toLowerCase(),
      type: 'article',
      category: article.category,
      url: `/articles/${article.slug}`,
      tags: article.tags || [article.category],
    });
  });

  // Add FAQ items
  faqItems.forEach((faq, index) => {
    items.push({
      id: `faq-${index}`,
      title: faq.question,
      description: faq.answer.slice(0, 150) + '...',
      content: `${faq.question} ${faq.answer}`.toLowerCase(),
      type: 'faq',
      category: faq.category,
      url: `/#faq`,
      tags: ['faq', faq.category],
    });
  });

  return items;
}

/**
 * Get search data - cached for reuse
 */
let cachedSearchData: SearchItem[] | null = null;

export function getSearchData(): SearchItem[] {
  if (!cachedSearchData) {
    cachedSearchData = generateSearchData();
  }
  return cachedSearchData;
}
