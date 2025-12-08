import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("p-2 bg-primary rounded-lg", className)}>
        <Terminal className="size-full text-primary-foreground" />
    </div>
  );
}
