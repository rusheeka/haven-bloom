import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { generateAnonymousName } from "@/lib/sanctuary-data";

interface UserData {
  anonymousId: string;
  username: string;
  petals: number;
  streak: number;
  lastCheckIn: string | null;
  journalEntries: JournalEntry[];
  favoriteAffirmations: number[];
  stories: StoryPost[];
  chatMessages: ChatMessage[];
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  mood: string;
  date: string;
}

export interface StoryPost {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  warmth: { "🌱": number; "💚": number; "🤍": number };
}

export interface ChatMessage {
  id: string;
  text: string;
  author: string;
  room: string;
  timestamp: string;
  reactions: { "💙": number; "🙏": number; "🌸": number; "🤗": number };
}

interface SanctuaryContextType {
  user: UserData;
  addPetals: (amount: number, reason: string) => void;
  checkIn: () => boolean;
  addJournalEntry: (text: string, mood: string) => void;
  toggleFavoriteAffirmation: (index: number) => void;
  addStory: (text: string) => void;
  sendWarmth: (storyId: string, type: "🌱" | "💚" | "🤍") => void;
  addChatMessage: (text: string, room: string) => void;
  reactToMessage: (msgId: string, type: "💙" | "🙏" | "🌸" | "🤗") => void;
}

const SanctuaryContext = createContext<SanctuaryContextType | null>(null);

const STORAGE_KEY = "unheard_sanctuary";

function loadUser(): UserData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  const id = crypto.randomUUID();
  return {
    anonymousId: id,
    username: generateAnonymousName(),
    petals: 0,
    streak: 0,
    lastCheckIn: null,
    journalEntries: [],
    favoriteAffirmations: [],
    stories: [],
    chatMessages: [],
    createdAt: new Date().toISOString(),
  };
}

export function SanctuaryProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData>(loadUser);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const addPetals = useCallback((amount: number, _reason: string) => {
    setUser(prev => ({ ...prev, petals: prev.petals + amount }));
  }, []);

  const checkIn = useCallback((): boolean => {
    const today = new Date().toDateString();
    if (user.lastCheckIn === today) return false;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = user.lastCheckIn === yesterday ? user.streak + 1 : 1;
    setUser(prev => ({ ...prev, lastCheckIn: today, streak: newStreak, petals: prev.petals + 1 }));
    return true;
  }, [user.lastCheckIn, user.streak]);

  const addJournalEntry = useCallback((text: string, mood: string) => {
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      text,
      mood,
      date: new Date().toISOString(),
    };
    setUser(prev => ({ ...prev, journalEntries: [entry, ...prev.journalEntries], petals: prev.petals + 2 }));
  }, []);

  const toggleFavoriteAffirmation = useCallback((index: number) => {
    setUser(prev => ({
      ...prev,
      favoriteAffirmations: prev.favoriteAffirmations.includes(index)
        ? prev.favoriteAffirmations.filter(i => i !== index)
        : [...prev.favoriteAffirmations, index],
    }));
  }, []);

  const addStory = useCallback((text: string) => {
    const story: StoryPost = {
      id: crypto.randomUUID(),
      text,
      author: user.username,
      timestamp: new Date().toISOString(),
      warmth: { "🌱": 0, "💚": 0, "🤍": 0 },
    };
    setUser(prev => ({ ...prev, stories: [story, ...prev.stories], petals: prev.petals + 3 }));
  }, [user.username]);

  const sendWarmth = useCallback((storyId: string, type: "🌱" | "💚" | "🤍") => {
    setUser(prev => ({
      ...prev,
      stories: prev.stories.map(s =>
        s.id === storyId ? { ...s, warmth: { ...s.warmth, [type]: s.warmth[type] + 1 } } : s
      ),
    }));
  }, []);

  const addChatMessage = useCallback((text: string, room: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      author: user.username,
      room,
      timestamp: new Date().toISOString(),
      reactions: { "💙": 0, "🙏": 0, "🌸": 0, "🤗": 0 },
    };
    setUser(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, msg].slice(-100),
      petals: prev.petals + 2,
    }));
  }, [user.username]);

  const reactToMessage = useCallback((msgId: string, type: "💙" | "🙏" | "🌸" | "🤗") => {
    setUser(prev => ({
      ...prev,
      chatMessages: prev.chatMessages.map(m =>
        m.id === msgId ? { ...m, reactions: { ...m.reactions, [type]: m.reactions[type] + 1 } } : m
      ),
    }));
  }, []);

  return (
    <SanctuaryContext.Provider
      value={{ user, addPetals, checkIn, addJournalEntry, toggleFavoriteAffirmation, addStory, sendWarmth, addChatMessage, reactToMessage }}
    >
      {children}
    </SanctuaryContext.Provider>
  );
}

export function useSanctuary() {
  const ctx = useContext(SanctuaryContext);
  if (!ctx) throw new Error("useSanctuary must be used within SanctuaryProvider");
  return ctx;
}
