import { CommandGenerator } from '@/components/command-generator';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Home() {
  return (
    <TooltipProvider>
      <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-2xl">
          <header className="flex flex-col items-center text-center mb-8">
            <Logo className="w-16 h-16 mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight text-primary">
              CommandPal
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Your AI assistant for the command line. Just say what you need.
            </p>
          </header>
          <CommandGenerator />
        </div>
      </main>
    </TooltipProvider>
  );
}
