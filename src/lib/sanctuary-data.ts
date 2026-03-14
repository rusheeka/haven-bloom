const adjectives = [
  "Gentle", "Quiet", "Brave", "Tender", "Peaceful", "Resilient", "Luminous",
  "Serene", "Radiant", "Hopeful", "Steady", "Blossoming", "Golden", "Healing",
  "Wandering", "Dreaming", "Floating", "Growing", "Rising", "Glowing"
];

const nouns = [
  "Oak", "Willow", "Fern", "River", "Cloud", "Petal", "Dawn", "Meadow",
  "Stone", "Breeze", "Robin", "Lotus", "Sage", "Harbor", "Ember", "Moon",
  "Sparrow", "Cedar", "Pearl", "Bloom"
];

export function generateAnonymousName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj}${noun}_${num}`;
}

export function getGrowthStage(petals: number): { stage: string; emoji: string; label: string } {
  if (petals < 5) return { stage: "seed", emoji: "🌰", label: "Seed" };
  if (petals < 15) return { stage: "sprout", emoji: "🌱", label: "Sprout" };
  if (petals < 30) return { stage: "bud", emoji: "🌿", label: "Growing Bud" };
  if (petals < 50) return { stage: "bloom", emoji: "🌸", label: "First Bloom" };
  if (petals < 80) return { stage: "flower", emoji: "🌺", label: "Full Flower" };
  return { stage: "garden", emoji: "🌻", label: "Radiant Garden" };
}

export const affirmations = [
  { text: "You are worthy of love and kindness.", category: "healing" },
  { text: "Your feelings are valid.", category: "healing" },
  { text: "You are more than what happened to you.", category: "strength" },
  { text: "Healing is not linear, and that's okay.", category: "healing" },
  { text: "You deserve to take up space.", category: "strength" },
  { text: "Your courage inspires growth.", category: "strength" },
  { text: "Today, you choose yourself.", category: "hope" },
  { text: "The light within you cannot be dimmed.", category: "hope" },
  { text: "You are not alone in this.", category: "hope" },
  { text: "Every breath is a small victory.", category: "healing" },
  { text: "You are becoming who you were always meant to be.", category: "hope" },
  { text: "It's okay to rest. The garden is patient.", category: "healing" },
  { text: "Your story matters.", category: "strength" },
  { text: "Softness is not weakness — it is radical bravery.", category: "strength" },
  { text: "You are safe in this moment.", category: "healing" },
  { text: "Tomorrow holds new petals.", category: "hope" },
];

export const helplines = [
  { name: "National Sexual Assault Hotline (RAINN)", number: "1-800-656-4673", url: "https://www.rainn.org" },
  { name: "Crisis Text Line", number: "Text HOME to 741741", url: "https://www.crisistextline.org" },
  { name: "National Suicide Prevention Lifeline", number: "988", url: "https://988lifeline.org" },
  { name: "National Domestic Violence Hotline", number: "1-800-799-7233", url: "https://www.thehotline.org" },
];

export const moods = [
  { emoji: "😌", label: "Peaceful", color: "hsl(150, 30%, 82%)" },
  { emoji: "😢", label: "Sad", color: "hsl(220, 25%, 75%)" },
  { emoji: "😰", label: "Anxious", color: "hsl(40, 40%, 78%)" },
  { emoji: "😤", label: "Frustrated", color: "hsl(10, 40%, 75%)" },
  { emoji: "🥰", label: "Grateful", color: "hsl(340, 45%, 80%)" },
  { emoji: "😶", label: "Numb", color: "hsl(240, 10%, 80%)" },
  { emoji: "💪", label: "Strong", color: "hsl(150, 40%, 70%)" },
  { emoji: "🌧️", label: "Heavy", color: "hsl(220, 20%, 65%)" },
];
