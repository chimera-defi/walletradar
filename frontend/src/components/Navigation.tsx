'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Wallet, Github, Twitter } from 'lucide-react';
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
  { href: '/docs/competitor-tracker', label: 'Competitors' },
  { href: '/docs/ramps', label: 'Ramps' },
  { href: '/articles', label: 'Articles' },
  { href: '/docs', label: 'Docs' },
];

interface NavigationProps {
  searchData?: SearchItem[];
}

export function Navigation({ searchData = [] }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-sky-400" />
            <span className="font-bold text-xl text-foreground">{brand.displayName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted/50',
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    ? 'text-sky-400 bg-sky-500/10'
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
          <div className="lg:hidden py-4 border-t border-border/60">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'text-sky-400 bg-sky-500/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-3 pt-2 mt-2 border-t border-border/60">
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
