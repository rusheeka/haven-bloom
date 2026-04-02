import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { generateAnonymousName } from "@/lib/sanctuary-data";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, Timestamp, doc, getDoc, setDoc, updateDoc, increment, deleteDoc } from "firebase/firestore";

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
  chatAgreed: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title?: string;
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
  addPetals: (amount: number, reason: string) => Promise<void>;
  checkIn: () => Promise<boolean>;
  addJournalEntry: (text: string, mood: string, title?: string) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  toggleFavoriteAffirmation: (index: number) => Promise<void>;
  addStory: (text: string) => Promise<void>;
  sendWarmth: (storyId: string, type: "🌱" | "💚" | "🤍") => Promise<void>;
  addChatMessage: (text: string, room: string) => Promise<void>;
  reactToMessage: (msgId: string, type: "💙" | "🙏" | "🌸" | "🤗") => Promise<void>;
  loginUser: (username: string, password: string) => Promise<boolean>;
  registerUser: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleDarkMode: () => void;
  changeUsername: (newName: string) => Promise<void>;
  setChatAgreed: (agreed: boolean) => Promise<void>;
}

const SanctuaryContext = createContext<SanctuaryContextType | null>(null);

const DARK_MODE_KEY = "unheard_dark_mode";

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
    chatAgreed: false,
    createdAt: new Date().toISOString(),
  };
}

export function SanctuaryProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData>(() => createDefaultUser("Guest"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem(DARK_MODE_KEY) === "true");

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
  }, [isDarkMode]);

  // Sync Firebase session and Firestore listeners
  useEffect(() => {
    let detachUserListener = () => {};
    let detachJournalListener = () => {};
    let detachStoriesListener = () => {};
    let detachChatListener = () => {};

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoggedIn(!!firebaseUser);
      
      // Always cleanup previous listeners when auth state changes
      detachUserListener();
      detachJournalListener();
      detachStoriesListener();
      detachChatListener();

      if (firebaseUser) {
        // Migration: If guest has entries, move them to Firestore
        setUser(prev => {
          if (prev.journalEntries.length > 0 && prev.username.startsWith("Soul_")) {
            console.log(`[Migration] Migrating ${prev.journalEntries.length} guest entries for ${firebaseUser.uid}`);
            prev.journalEntries.forEach(async (entry) => {
              // Avoid re-migrating temp or existing firestore entries
              if (entry.id.includes("-")) { 
                try {
                  await addDoc(collection(db, "journalEntries"), {
                    title: entry.title,
                    text: entry.text,
                    mood: entry.mood,
                    userId: firebaseUser.uid,
                    date: entry.date, // Preserve original date
                  });
                } catch (e) {
                  console.error("[Migration] Error migrating entry:", e);
                }
              }
            });
            // Update petals in user doc (as an increment)
            if (prev.petals > 0) {
              const userRef = doc(db, "users", firebaseUser.uid);
              updateDoc(userRef, { petals: increment(prev.petals) }).catch(e => console.error("[Migration] Error migrating petals:", e));
            }
          }
          return prev;
        });

        // Sync User Doc
        const userRef = doc(db, "users", firebaseUser.uid);
        detachUserListener = onSnapshot(userRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUser(prev => ({
              ...prev,
              username: data.username || prev.username,
              petals: data.petals ?? prev.petals,
              streak: data.streak ?? prev.streak,
              lastCheckIn: data.lastCheckIn || prev.lastCheckIn,
              favoriteAffirmations: data.favoriteAffirmations || prev.favoriteAffirmations,
              chatAgreed: data.chatAgreed ?? prev.chatAgreed,
            }));
          } else {
            const initialData = {
              username: firebaseUser.displayName || "Soul",
              petals: 0,
              streak: 0,
              lastCheckIn: null,
              favoriteAffirmations: [],
              chatAgreed: false,
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, initialData);
          }
        });

        // Sync Journal
        const q = query(
          collection(db, "journalEntries"),
          where("userId", "==", firebaseUser.uid),
          orderBy("date", "desc")
        );

        detachJournalListener = onSnapshot(q, (snapshot) => {
          const entries = snapshot.docs.map(doc => {
            const data = doc.data({ serverTimestamps: 'estimate' });
            return {
              id: doc.id,
              ...data,
              date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : (data.date || new Date().toISOString()),
            };
          }) as JournalEntry[];
          
          setUser(prev => ({ ...prev, journalEntries: entries }));
        }, (error) => {
          console.error("[Firestore] Journal Sync Error:", error);
        });
      } else {
        setUser(createDefaultUser(generateAnonymousName()));
      }

      // Global Listeners (Always active, even for guests)
      const storiesQuery = query(collection(db, "stories"), orderBy("timestamp", "desc"));
      detachStoriesListener = onSnapshot(storiesQuery, (snapshot) => {
        const stories = snapshot.docs.map(doc => {
          const data = doc.data({ serverTimestamps: 'estimate' });
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : data.timestamp,
          };
        }) as StoryPost[];
        setUser(prev => ({ ...prev, stories }));
      });

      const chatQuery = query(collection(db, "chatMessages"), orderBy("timestamp", "asc"));
      detachChatListener = onSnapshot(chatQuery, (snapshot) => {
        const messages = snapshot.docs.map(doc => {
          const data = doc.data({ serverTimestamps: 'estimate' });
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : data.timestamp,
          };
        }) as ChatMessage[];
        setUser(prev => ({ ...prev, chatMessages: messages }));
      });
    });

    return () => {
      unsubscribe();
      detachUserListener();
      detachJournalListener();
      detachStoriesListener();
      detachChatListener();
    };
  }, []);

  const loginUser = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const dummyEmail = `${username.toLowerCase()}@unheard.local`;
      await signInWithEmailAndPassword(auth, dummyEmail, password);
      return true;
    } catch (e) {
      console.error("Login failed:", e);
      return false;
    }
  }, []);

  const registerUser = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const dummyEmail = `${username.toLowerCase()}@unheard.local`;
      
      // Register with Firebase
      const cred = await createUserWithEmailAndPassword(auth, dummyEmail, password);
      await updateProfile(cred.user, { displayName: username });

      // Create profile in Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        username,
        petals: 0,
        streak: 0,
        lastCheckIn: null,
        favoriteAffirmations: [],
        createdAt: serverTimestamp()
      });

      return true;
    } catch (e) {
      console.error("Registration failed:", e);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    signOut(auth).catch(console.error);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const changeUsername = useCallback(async (newName: string) => {
    if (isLoggedIn && auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { username: newName });
      await updateProfile(auth.currentUser, { displayName: newName });
    } else {
      setUser((prev) => ({ ...prev, username: newName }));
    }
  }, [isLoggedIn]);

  const addPetals = useCallback(async (amount: number, _reason: string) => {
    if (isLoggedIn && auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { petals: increment(amount) });
    } else {
      setUser((prev) => ({ ...prev, petals: prev.petals + amount }));
    }
  }, [isLoggedIn]);

  const checkIn = useCallback(async (): Promise<boolean> => {
    const today = new Date().toDateString();
    if (user.lastCheckIn === today) return false;
    
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = user.lastCheckIn === yesterday ? user.streak + 1 : 1;

    if (isLoggedIn && auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        lastCheckIn: today,
        streak: newStreak,
        petals: increment(1)
      });
    } else {
      setUser((prev) => ({ ...prev, lastCheckIn: today, streak: newStreak, petals: prev.petals + 1 }));
    }
    return true;
  }, [isLoggedIn, user.lastCheckIn, user.streak]);

  const addJournalEntry = useCallback(async (text: string, mood: string, title?: string) => {
    const newEntry = {
      title,
      text,
      mood,
      date: new Date().toISOString()
    };

    if (isLoggedIn && auth.currentUser) {
      // Optimistic update for immediate visibility
      const tempEntry: JournalEntry = { id: `temp-${Date.now()}`, ...newEntry };
      setUser((prev) => ({ ...prev, journalEntries: [tempEntry, ...prev.journalEntries], petals: prev.petals + 2 }));

      try {
        await addDoc(collection(db, "journalEntries"), {
          ...newEntry,
          userId: auth.currentUser.uid,
          date: serverTimestamp()
        });
      } catch (e) {
        console.error("Error adding journal entry:", e);
      }
    } else {
      const entry: JournalEntry = { id: crypto.randomUUID(), ...newEntry };
      setUser((prev) => ({ ...prev, journalEntries: [entry, ...prev.journalEntries], petals: prev.petals + 2 }));
    }
  }, [isLoggedIn, user.petals]);

  const deleteJournalEntry = useCallback(async (id: string) => {
    if (isLoggedIn && auth.currentUser) {
      try {
        await deleteDoc(doc(db, "journalEntries", id));
      } catch (e) {
        console.error("Error deleting journal entry from Firestore:", e);
      }
    } else {
      setUser((prev) => ({
        ...prev,
        journalEntries: prev.journalEntries.filter((e) => e.id !== id),
      }));
    }
  }, [isLoggedIn]);

  const toggleFavoriteAffirmation = useCallback(async (index: number) => {
    const newFavorites = user.favoriteAffirmations.includes(index)
      ? user.favoriteAffirmations.filter((i) => i !== index)
      : [...user.favoriteAffirmations, index];

    if (isLoggedIn && auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { favoriteAffirmations: newFavorites });
    } else {
      setUser((prev) => ({ ...prev, favoriteAffirmations: newFavorites }));
    }
  }, [isLoggedIn, user.favoriteAffirmations]);

  const addStory = useCallback(async (text: string) => {
    const storyData = {
      text,
      author: user.username,
      timestamp: new Date().toISOString(),
      warmth: { "🌱": 0, "💚": 0, "🤍": 0 },
    };

    if (isLoggedIn && auth.currentUser) {
      await addDoc(collection(db, "stories"), {
        ...storyData,
        timestamp: serverTimestamp()
      });
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { petals: increment(3) });
    } else {
      const story: StoryPost = { id: crypto.randomUUID(), ...storyData };
      setUser((prev) => ({ ...prev, stories: [story, ...prev.stories], petals: prev.petals + 3 }));
    }
  }, [isLoggedIn, user.username]);

  const sendWarmth = useCallback(async (storyId: string, type: "🌱" | "💚" | "🤍") => {
    const storyRef = doc(db, "stories", storyId);
    await updateDoc(storyRef, {
      [`warmth.${type}`]: increment(1)
    });
  }, []);

  const addChatMessage = useCallback(async (text: string, room: string) => {
    const msgData = {
      text,
      author: user.username,
      room,
      timestamp: new Date().toISOString(),
      reactions: { "💙": 0, "🙏": 0, "🌸": 0, "🤗": 0 },
    };

    if (isLoggedIn && auth.currentUser) {
      await addDoc(collection(db, "chatMessages"), {
        ...msgData,
        timestamp: serverTimestamp()
      });
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { petals: increment(2) });
    } else {
      const msg: ChatMessage = { id: crypto.randomUUID(), ...msgData };
      setUser((prev) => ({
        ...prev,
        chatMessages: [...prev.chatMessages, msg].slice(-100),
        petals: prev.petals + 2,
      }));
    }
  }, [isLoggedIn, user.username]);

  const reactToMessage = useCallback(async (msgId: string, type: "💙" | "🙏" | "🌸" | "🤗") => {
    const msgRef = doc(db, "chatMessages", msgId);
    await updateDoc(msgRef, {
      [`reactions.${type}`]: increment(1)
    });
  }, []);

  const setChatAgreed = useCallback(async (agreed: boolean) => {
    if (isLoggedIn && auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { chatAgreed: agreed });
    } else {
      setUser((prev) => ({ ...prev, chatAgreed: agreed }));
    }
  }, [isLoggedIn]);

  return (
    <SanctuaryContext.Provider
      value={{
        user,
        isLoggedIn,
        isDarkMode,
        addPetals,
        checkIn,
        addJournalEntry,
        deleteJournalEntry,
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
        setChatAgreed,
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
