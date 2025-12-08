"use client";

import { useState } from 'react';
import {
  Wand2,
  FileQuestion,
  History,
  Bookmark,
  PanelLeft,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Logo from '@/components/logo';
import type { ActiveView } from '@/lib/types';
import NaturalLanguageForm from '@/components/feature-views/natural-language-form';
import CommandExplanationForm from '@/components/feature-views/command-explanation-form';
import CommandHistoryView from '@/components/feature-views/command-history-view';
import SavedCommandsView from '@/components/feature-views/saved-commands-view';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';

const NAV_ITEMS = [
  {
    id: 'natural-language',
    label: 'Natural Language',
    icon: Wand2,
  },
  { id: 'explain', label: 'Explain', icon: FileQuestion },
  { id: 'history', label: 'History', icon: History },
  { id: 'saved', label: 'Saved', icon: Bookmark },
] as const;

function SidebarNav({
  activeView,
  setActiveView,
}: {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}) {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={activeView === id ? 'secondary' : 'ghost'}
          onClick={() => setActiveView(id)}
          className="justify-start"
        >
          <Icon className="mr-2 size-4" />
          {label}
        </Button>
      ))}
    </nav>
  );
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('natural-language');

  const renderActiveView = () => {
    switch (activeView) {
      case 'natural-language':
        return <NaturalLanguageForm />;
      case 'explain':
        return <CommandExplanationForm />;
      case 'history':
        return <CommandHistoryView />;
      case 'saved':
        return <SavedCommandsView />;
      default:
        return <NaturalLanguageForm />;
    }
  };

  return (
    <TooltipProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Logo />
            </div>
            <div className="flex-1">
              <SidebarNav activeView={activeView} setActiveView={setActiveView} />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 mb-2">
                  <Logo />
                </div>
                <SidebarNav activeView={activeView} setActiveView={setActiveView} />
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* Optional: Add search or other header elements here */}
            </div>
            <ThemeToggle />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
