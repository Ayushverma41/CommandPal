
"use client";

import { useState } from 'react';
import { History, Trash2, Wand2, FileQuestion } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { CommandEntry } from '@/lib/types';
import CodeBlock from '../common/code-block';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 5;

function HistoryItem({ item }: { item: CommandEntry }) {
  const isExplain = item.type === 'explain';

  return (
    <div className="p-4 border rounded-lg bg-card/50 transition-colors hover:bg-card">
        <div className="flex justify-between items-start">
            <div className='space-y-1'>
                <div className="flex items-center gap-2 text-sm font-medium">
                    {isExplain ? <FileQuestion className="size-4 text-primary" /> : <Wand2 className="size-4 text-primary" />}
                    <span>{isExplain ? 'Explained Command' : 'Generated Command'}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
            </div>
            <p className="text-xs text-muted-foreground">{item.input.operatingSystem}</p>
        </div>
        <div className="mt-4 space-y-3">
            <div className='space-y-1'>
                <p className="text-xs font-semibold text-muted-foreground">INPUT</p>
                <p className="text-sm font-mono p-2 bg-background rounded-md">
                    {isExplain ? item.input.command : item.input.naturalLanguageQuery}
                </p>
            </div>
             <div className='space-y-1'>
                <p className="text-xs font-semibold text-muted-foreground">OUTPUT</p>
                {isExplain ? (
                     <p className="text-sm p-2 bg-background rounded-md">{item.output}</p>
                ) : (
                    <CodeBlock code={item.output} className='text-sm' />
                )}
            </div>
        </div>
    </div>
  );
}

export default function CommandHistoryView() {
  const [history, setHistory] = useLocalStorage<CommandEntry[]>('command-history', []);
  const [currentPage, setCurrentPage] = useState(0);

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentPage(0);
  };

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHistory = history.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };


  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className='space-y-1.5'>
            <CardTitle className="flex items-center gap-2">
                <History className="text-primary" />
                Command History
            </CardTitle>
            <CardDescription>
                Review your previously generated and explained commands.
            </CardDescription>
        </div>
        {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-4" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your command history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className="space-y-4">
            {currentHistory.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <History className="mx-auto size-12 mb-4" />
            <h3 className="text-lg font-semibold">No history yet</h3>
            <p>Your generated commands will appear here.</p>
          </div>
        )}
        {totalPages > 1 && (
            <Pagination className="mt-6">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={handlePreviousPage} disabled={currentPage === 0}/>
                    </PaginationItem>
                    <PaginationItem>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext onClick={handleNextPage} disabled={currentPage >= totalPages - 1}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )}
      </CardContent>
    </Card>
  );
}
