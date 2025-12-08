import { Terminal } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
      <div className="p-1.5 bg-secondary rounded-lg">
        <Terminal className="size-5 text-secondary-foreground" />
      </div>
      <span className="font-semibold text-lg text-foreground group-data-[collapsible=icon]:hidden">
        CommandPal
      </span>
    </div>
  );
}
