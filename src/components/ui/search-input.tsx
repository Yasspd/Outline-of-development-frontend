'use client';

import { Search } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export function SearchInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className={cn(
        'flex h-11 items-center gap-3 rounded-full border border-border bg-panel px-4 text-muted transition-colors focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-brand-blue/15',
        className,
      )}
    >
      <Search className="h-4 w-4 text-brand-red" strokeWidth={1.8} />
      <input
        className="h-full w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        {...props}
      />
    </div>
  );
}
