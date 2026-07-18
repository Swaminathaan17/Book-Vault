import React from 'react';
import { cn } from '@/lib/utils';

const illustrations = {
  books: (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Shelf */}
      <rect x="10" y="95" width="140" height="6" rx="3" fill="currentColor" opacity="0.15" />
      {/* Book 1 - tall blue */}
      <rect x="22" y="52" width="18" height="43" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="22" y="52" width="4" height="43" rx="1" fill="currentColor" opacity="0.15" />
      {/* Book 2 - medium indigo */}
      <rect x="43" y="60" width="14" height="35" rx="2" fill="currentColor" opacity="0.45" />
      <rect x="43" y="60" width="3" height="35" rx="1" fill="currentColor" opacity="0.2" />
      {/* Book 3 - short */}
      <rect x="60" y="70" width="16" height="25" rx="2" fill="currentColor" opacity="0.25" />
      {/* Gap / missing books */}
      <line x1="79" y1="95" x2="79" y2="62" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
      <line x1="100" y1="95" x2="100" y2="62" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
      {/* Question mark in gap */}
      <text x="88" y="84" textAnchor="middle" fontSize="18" fill="currentColor" opacity="0.2" fontWeight="bold">?</text>
      {/* Book 4 - right side */}
      <rect x="103" y="58" width="13" height="37" rx="2" fill="currentColor" opacity="0.35" />
      <rect x="103" y="58" width="3" height="37" rx="1" fill="currentColor" opacity="0.15" />
      {/* Book 5 */}
      <rect x="119" y="65" width="17" height="30" rx="2" fill="currentColor" opacity="0.2" />
      {/* Magnifying glass overlay */}
      <circle cx="112" cy="34" r="16" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
      <line x1="123" y1="46" x2="133" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      <circle cx="112" cy="34" r="9" fill="currentColor" opacity="0.06" />
    </svg>
  ),
  members: (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Person 1 - center */}
      <circle cx="80" cy="42" r="18" fill="currentColor" opacity="0.2" />
      <path d="M50 95 C50 75 62 68 80 68 C98 68 110 75 110 95" fill="currentColor" opacity="0.15" />
      {/* Person 2 - left, faded */}
      <circle cx="40" cy="48" r="13" fill="currentColor" opacity="0.12" />
      <path d="M18 95 C18 79 28 73 40 73 C52 73 62 79 62 95" fill="currentColor" opacity="0.08" />
      {/* Person 3 - right, faded */}
      <circle cx="120" cy="48" r="13" fill="currentColor" opacity="0.12" />
      <path d="M98 95 C98 79 108 73 120 73 C132 73 142 79 142 95" fill="currentColor" opacity="0.08" />
      {/* Plus icon */}
      <circle cx="80" cy="42" r="8" fill="currentColor" opacity="0.12" />
      <line x1="80" y1="37" x2="80" y2="47" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="75" y1="42" x2="85" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Big magnifying glass */}
      <circle cx="68" cy="52" r="30" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <circle cx="68" cy="52" r="20" fill="currentColor" opacity="0.06" />
      <line x1="91" y1="76" x2="115" y2="100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.25" />
      {/* X inside the lens */}
      <line x1="58" y1="42" x2="78" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      <line x1="78" y1="42" x2="58" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      {/* Small dots for "no results" feel */}
      <circle cx="120" cy="38" r="4" fill="currentColor" opacity="0.1" />
      <circle cx="132" cy="52" r="3" fill="currentColor" opacity="0.08" />
      <circle cx="24" cy="82" r="4" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Grid of category cards, faded */}
      <rect x="18" y="20" width="52" height="38" rx="6" fill="currentColor" opacity="0.12" />
      <rect x="90" y="20" width="52" height="38" rx="6" fill="currentColor" opacity="0.08" />
      <rect x="18" y="66" width="52" height="38" rx="6" fill="currentColor" opacity="0.08" />
      {/* Plus card */}
      <rect x="90" y="66" width="52" height="38" rx="6" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" opacity="0.2" />
      <line x1="116" y1="78" x2="116" y2="92" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
      <line x1="109" y1="85" x2="123" y2="85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
    </svg>
  ),
};

type Variant = keyof typeof illustrations;

interface EmptyStateProps {
  variant?: Variant;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ variant = 'search', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="w-36 h-28 text-foreground mb-4">
        {illustrations[variant]}
      </div>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
