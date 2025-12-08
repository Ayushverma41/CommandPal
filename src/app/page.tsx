"use client";

import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Wand2, FileQuestion, History, Bookmark } from 'lucide-react';
import type { ActiveView } from '@/lib/types';
import Logo from '@/components/logo';
import NaturalLanguageForm from '@/components/feature-views/natural-language-form';
import CommandExplanationForm from '@/components/feature-views/command-explanation-form';
import CommandHistoryView from '@/components/feature-views/command-history-view';
import SavedCommandsView from '@/components/feature-views/saved-commands-view';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { id: 'natural-language', label: 'Natural Language', icon: Wand2 },
  { id: 'explain', label: 'Explain Command', icon: FileQuestion },
  { id: 'history', label: 'History', icon: History },
  { id: 'saved', label: 'Saved Commands', icon: Bookmark },
];

export default function Home() {
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
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => setActiveView(item.id as ActiveView)}
                  isActive={activeView === item.id}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  className="justify-start"
                >
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="mb-2" />
          <p className="px-4 py-2 text-xs text-muted-foreground">
            © {new Date().getFullYear()} CommandPal
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex items-center gap-4 border-b bg-background/50 backdrop-blur-sm p-2 md:hidden">
          <SidebarTrigger />
          <Logo />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
