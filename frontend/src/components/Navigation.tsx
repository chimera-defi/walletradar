'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Wallet } from 'lucide-react';
import { Github, Twitter } from './BrandIcons';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { SiteSearch } from './SiteSearch';
import type { SearchItem } from '@/lib/search-data';
import { trackOutboundLink } from '@/lib/analytics';
import { appendUtm, brand } from '@/lib/brand';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/docs/software-wallets', label: 'Software' },
  { href: '/docs/hardware-wallets', label: 'Hardware' },
  { href: '/docs/crypto-cards', label: 'Cards' },
  { href: '/docs/ramps', label: 'Ramps' },
  { href: '/docs/qr-payments', label: 'QR Payments' },
  { href: '/articles', label: 'Articles' },
  { href: '/docs', label: 'Docs' },
];

interface NavigationProps {
  searchData?: SearchItem[];
}

function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (href === '/') return path === '/';
  if (href === '/docs') return path === '/docs';
  return path === href || path.startsWith(`${href}/`);
}

export function Navigation({ searchData = [] }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <nav aria-label="Main" className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            <span className="font-bold text-xl text-foreground">{brand.displayName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted/50',
                  isActive(pathname, item.href)
                    ? 'text-sky-700 dark:text-sky-400 bg-sky-500/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Site-wide search */}
            <SiteSearch searchData={searchData} />

            <ThemeToggle />

            <a
              href={appendUtm(brand.twitterUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutboundLink(brand.twitterUrl, 'Twitter')}
              className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors p-2"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href={appendUtm(brand.githubUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutboundLink(brand.githubUrl, 'GitHub')}
              className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors p-2"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive(pathname, item.href)
                      ? 'text-sky-700 dark:text-sky-400 bg-sky-500/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-3 pt-2 mt-2 border-t border-border">
                <a
                  href={appendUtm(brand.twitterUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOutboundLink(brand.twitterUrl, 'Twitter')}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={appendUtm(brand.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOutboundLink(brand.githubUrl, 'GitHub')}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
