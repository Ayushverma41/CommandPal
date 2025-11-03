'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message } from '@/components/ConversationHistory';

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};

const HISTORY_STORAGE_KEY = 'commandpal-chat-history';

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setConversations(parsedHistory.conversations || []);
        setActiveConversationId(parsedHistory.activeConversationId || null);
        if (!parsedHistory.activeConversationId && parsedHistory.conversations?.length > 0) {
            setActiveConversationId(parsedHistory.conversations[0].id);
        } else if (!parsedHistory.activeConversationId && parsedHistory.conversations?.length === 0) {
            startNewConversation(false); // don't persist yet
        }
      } else {
        // If no history, start a new conversation
        startNewConversation(false); // don't persist yet
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage:', error);
      startNewConversation(false); // don't persist yet
    } finally {
        setIsLoading(false);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isLoading) return; // Don't save during initial load
    try {
      const dataToSave = JSON.stringify({ conversations, activeConversationId });
      localStorage.setItem(HISTORY_STORAGE_KEY, dataToSave);
    } catch (error) {
      console.error('Failed to save chat history to localStorage:', error);
    }
  }, [conversations, activeConversationId, isLoading]);
  
  const getConversationTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return "New Chat";
    return firstUserMessage.text.substring(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
  };

  const startNewConversation = useCallback((persist = true) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
    };
    if (persist) {
        setConversations((prev) => [newConversation, ...prev]);
    } else {
        setConversations([newConversation]);
    }
    setActiveConversationId(newConversation.id);
  }, []);

  const setActiveConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);
  
  const updateConversation = useCallback((id: string, updates: Partial<Omit<Conversation, 'id'>>) => {
      setConversations(prev =>
        prev.map(convo => {
          if (convo.id === id) {
            const updatedConvo = { ...convo, ...updates };
            // Update title if messages are changing and it's a new chat
            if (updates.messages && (convo.title === 'New Chat' || !convo.title)) {
              updatedConvo.title = getConversationTitle(updates.messages);
            }
            return updatedConvo;
          }
          return convo;
        })
      );
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
        const remaining = prev.filter(convo => convo.id !== id);
        // If the deleted conversation was active, switch to the first available one or start new
        if (activeConversationId === id) {
          if (remaining.length > 0) {
            setActiveConversationId(remaining[0].id);
          } else {
            // This case is tricky, we'll create a new one but the state update for that is separate
          }
        }
        return remaining;
    });

    if (activeConversationId === id) {
        const remainingConversations = conversations.filter(convo => convo.id !== id);
        if (remainingConversations.length > 0) {
          setActiveConversationId(remainingConversations[0].id);
        } else {
          startNewConversation();
        }
      }
    
  }, [activeConversationId, conversations, startNewConversation]);

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
    startNewConversation();
  }, [startNewConversation]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return {
    conversations,
    activeConversation,
    isLoading,
    startNewConversation,
    setActiveConversation,
    updateConversation,
    deleteConversation,
    clearAllConversations,
  };
}