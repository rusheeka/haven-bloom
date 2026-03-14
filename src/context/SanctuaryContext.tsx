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

interface StoredAccount {
  username: string;
  password: string;
  data: UserData;
}

interface SanctuaryContextType {
  user: UserData;
  isLoggedIn: boolean;
  isDarkMode: boolean;
  addPetals: (amount: number, reason: string) => void;
  checkIn: () => boolean;
  addJournalEntry: (text: string, mood: string) => void;
  toggleFavoriteAffirmation: (index: number) => void;
  addStory: (text: string) => void;
  sendWarmth: (storyId: string, type: "🌱" | "💚" | "🤍") => void;
  addChatMessage: (text: string, room: string) => void;
  reactToMessage: (msgId: string, type: "💙" | "🙏" | "🌸" | "🤗") => void;
  loginUser: (username: string, password: string) => boolean;
  registerUser: (username: string, password: string) => boolean;
  logout: () => void;
  toggleDarkMode: () => void;
  changeUsername: (newName: string) => void;
}

const SanctuaryContext = createContext<SanctuaryContextType | null>(null);

const ACCOUNTS_KEY = "unheard_accounts";
const ACTIVE_KEY = "unheard_active_user";
const DARK_MODE_KEY = "unheard_dark_mode";

function getAccounts(): StoredAccount[] {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function createDefaultUser(username: string): UserData {
  return {
    anonymousId: crypto.randomUUID(),
    username,
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

function loadActiveUser(): UserData | null {
  try {
    const activeUsername = localStorage.getItem(ACTIVE_KEY);
    if (!activeUsername) return null;
    const accounts = getAccounts();
    const account = accounts.find((a) => a.username === activeUsername);
    return account?.data || null;
  } catch {}
  return null;
}

export function SanctuaryProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData>(() => loadActiveUser() || createDefaultUser("Guest"));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem(ACTIVE_KEY));
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem(DARK_MODE_KEY) === "true");

  // Persist user data to their account
  useEffect(() => {
    if (!isLoggedIn) return;
    const accounts = getAccounts();
    const idx = accounts.findIndex((a) => a.username === localStorage.getItem(ACTIVE_KEY));
    if (idx >= 0) {
      accounts[idx].data = user;
      saveAccounts(accounts);
    }
  }, [user, isLoggedIn]);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
  }, [isDarkMode]);

  const loginUser = useCallback((username: string, password: string): boolean => {
    const accounts = getAccounts();
    const account = accounts.find((a) => a.username === username && a.password === password);
    if (!account) return false;
    localStorage.setItem(ACTIVE_KEY, username);
    setUser(account.data);
    setIsLoggedIn(true);
    return true;
  }, []);

  const registerUser = useCallback((username: string, password: string): boolean => {
    const accounts = getAccounts();
    if (accounts.some((a) => a.username === username)) return false;
    const newUser = createDefaultUser(username);
    accounts.push({ username, password, data: newUser });
    saveAccounts(accounts);
    localStorage.setItem(ACTIVE_KEY, username);
    setUser(newUser);
    setIsLoggedIn(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACTIVE_KEY);
    setIsLoggedIn(false);
    setUser(createDefaultUser("Guest"));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const changeUsername = useCallback((newName: string) => {
    const accounts = getAccounts();
    const activeUsername = localStorage.getItem(ACTIVE_KEY);
    const idx = accounts.findIndex((a) => a.username === activeUsername);
    if (idx >= 0) {
      accounts[idx].username = newName;
      accounts[idx].data.username = newName;
      saveAccounts(accounts);
      localStorage.setItem(ACTIVE_KEY, newName);
    }
    setUser((prev) => ({ ...prev, username: newName }));
  }, []);

  const addPetals = useCallback((amount: number, _reason: string) => {
    setUser((prev) => ({ ...prev, petals: prev.petals + amount }));
  }, []);

  const checkIn = useCallback((): boolean => {
    const today = new Date().toDateString();
    if (user.lastCheckIn === today) return false;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = user.lastCheckIn === yesterday ? user.streak + 1 : 1;
    setUser((prev) => ({ ...prev, lastCheckIn: today, streak: newStreak, petals: prev.petals + 1 }));
    return true;
  }, [user.lastCheckIn, user.streak]);

  const addJournalEntry = useCallback((text: string, mood: string) => {
    const entry: JournalEntry = { id: crypto.randomUUID(), text, mood, date: new Date().toISOString() };
    setUser((prev) => ({ ...prev, journalEntries: [entry, ...prev.journalEntries], petals: prev.petals + 2 }));
  }, []);

  const toggleFavoriteAffirmation = useCallback((index: number) => {
    setUser((prev) => ({
      ...prev,
      favoriteAffirmations: prev.favoriteAffirmations.includes(index)
        ? prev.favoriteAffirmations.filter((i) => i !== index)
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
    setUser((prev) => ({ ...prev, stories: [story, ...prev.stories], petals: prev.petals + 3 }));
  }, [user.username]);

  const sendWarmth = useCallback((storyId: string, type: "🌱" | "💚" | "🤍") => {
    setUser((prev) => ({
      ...prev,
      stories: prev.stories.map((s) =>
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
    setUser((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, msg].slice(-100),
      petals: prev.petals + 2,
    }));
  }, [user.username]);

  const reactToMessage = useCallback((msgId: string, type: "💙" | "🙏" | "🌸" | "🤗") => {
    setUser((prev) => ({
      ...prev,
      chatMessages: prev.chatMessages.map((m) =>
        m.id === msgId ? { ...m, reactions: { ...m.reactions, [type]: m.reactions[type] + 1 } } : m
      ),
    }));
  }, []);

  return (
    <SanctuaryContext.Provider
      value={{
        user,
        isLoggedIn,
        isDarkMode,
        addPetals,
        checkIn,
        addJournalEntry,
        toggleFavoriteAffirmation,
        addStory,
        sendWarmth,
        addChatMessage,
        reactToMessage,
        loginUser,
        registerUser,
        logout,
        toggleDarkMode,
        changeUsername,
      }}
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
