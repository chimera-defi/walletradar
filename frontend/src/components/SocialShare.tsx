'use client';

import { Mail, Link2, Check } from 'lucide-react';
import { Twitter, Facebook, Linkedin } from './BrandIcons';
import { useState } from 'react';
import { getSocialShareUrls } from '@/lib/seo';
import { trackShare, trackCopyLink } from '@/lib/analytics';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  size?: 'default' | 'large';
}

/**
 * Social sharing buttons component
 * Provides share functionality for Twitter, Facebook, LinkedIn, Email, and Copy Link
 */
export function SocialShare({ url, title, description, className = '', size = 'default' }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrls = getSocialShareUrls(url, title, description);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      trackCopyLink(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    trackShare(platform, 'page', url);
    const shareUrl = shareUrls[platform];
    if (platform === 'email') {
      window.location.assign(shareUrl);
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  };

  const isLarge = size === 'large';
  const iconSize = isLarge ? 'h-5 w-5' : 'h-4 w-4';
  const buttonPadding = isLarge ? 'p-3' : 'p-2';
  const labelSize = isLarge ? 'text-base font-medium' : 'text-sm';

  const buttons = [
    {
      platform: 'twitter' as const,
      icon: Twitter,
      label: 'Share on Twitter',
      shortLabel: 'Twitter',
      className: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
      bgClass: 'bg-muted text-foreground',
    },
    {
      platform: 'facebook' as const,
      icon: Facebook,
      label: 'Share on Facebook',
      shortLabel: 'Facebook',
      className: 'hover:bg-[#4267B2]/10 hover:text-[#4267B2]',
      bgClass: 'bg-muted text-foreground',
    },
    {
      platform: 'linkedin' as const,
      icon: Linkedin,
      label: 'Share on LinkedIn',
      shortLabel: 'LinkedIn',
      className: 'hover:bg-[#0077B5]/10 hover:text-[#0077B5]',
      bgClass: 'bg-muted text-foreground',
    },
    {
      platform: 'email' as const,
      icon: Mail,
      label: 'Share via Email',
      shortLabel: 'Email',
      className: 'hover:bg-muted',
      bgClass: 'bg-muted',
    },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className={`${labelSize} text-muted-foreground mr-1 w-full sm:w-auto`}>Share:</span>
      {buttons.map(({ platform, icon: Icon, label, shortLabel, className: btnClass, bgClass }) => (
        <button
          key={platform}
          onClick={() => handleShare(platform)}
          className={`${buttonPadding} rounded-lg text-muted-foreground transition-colors ${isLarge ? `${bgClass} border border-border` : btnClass} ${isLarge ? 'flex items-center gap-2' : ''}`}
          title={label}
          aria-label={label}
        >
          <Icon className={iconSize} />
          {isLarge && <span className="hidden sm:inline text-sm">{shortLabel}</span>}
        </button>
      ))}
      <button
        onClick={handleCopyLink}
        className={`${buttonPadding} rounded-lg text-muted-foreground hover:bg-muted transition-colors ${isLarge ? 'bg-muted border border-border flex items-center gap-2' : ''}`}
        title={copied ? 'Copied!' : 'Copy link'}
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className={`${iconSize} text-green-500`} />
            {isLarge && <span className="hidden sm:inline text-sm text-green-500">Copied!</span>}
          </>
        ) : (
          <>
            <Link2 className={iconSize} />
            {isLarge && <span className="hidden sm:inline text-sm">Copy</span>}
          </>
        )}
      </button>
    </div>
  );
}
