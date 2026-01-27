import bg from './Bg.png'

export const assets = {
    bg
}

// ---------------------------------------------
// CATEGORIES (for filtering & discovery)
// ---------------------------------------------
export const categories = [
  {
    id: "art",
    name: "Art & Creativity",
    icon: "🎨",
  },
  {
    id: "music",
    name: "Music & Performance",
    icon: "🎶",
  },
  {
    id: "wellness",
    name: "Mental Wellness",
    icon: "🧠",
  },
  {
    id: "yoga",
    name: "Yoga & Meditation",
    icon: "🧘‍♀️",
  },
  {
    id: "community",
    name: "Community Meetups",
    icon: "🤝",
  },
]

// ---------------------------------------------
// DUMMY COMMUNITIES DATA
// ---------------------------------------------
export const dummyCommunities = [
  {
    _id: "comm_001",
    name: "Udaipur Art Circle",
    description:
      "A collective of local painters, sketch artists, and illustrators hosting weekly art jams and exhibitions.",
    category: "Art & Creativity",
    coverImage:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    logo:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe",
    location: "Fateh Sagar, Udaipur",
    membersCount: 320,
    rating: 4.7,
  },
  {
    _id: "comm_002",
    name: "Mindful Udaipur",
    description:
      "Mental wellness sessions including group therapy, mindfulness talks, and psychology workshops.",
    category: "Mental Wellness",
    coverImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    logo:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
    location: "Shobhagpura, Udaipur",
    membersCount: 210,
    rating: 4.9,
  },
  {
    _id: "comm_003",
    name: "Raaga Collective",
    description:
      "A music-first community promoting indie artists, jam sessions, and acoustic evenings.",
    category: "Music & Performance",
    coverImage:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    logo:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    location: "Old City, Udaipur",
    membersCount: 180,
    rating: 4.6,
  },
  {
    _id: "comm_004",
    name: "Lake City Yoga",
    description:
      "Morning yoga, guided meditation, and breathwork sessions near Udaipur’s lakes.",
    category: "Yoga & Meditation",
    coverImage:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
    logo:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a",
    location: "Neemach Mata, Udaipur",
    membersCount: 260,
    rating: 4.8,
  },
]


// ---------------------------------------------
// SESSIONS / EVENTS DATA
// ---------------------------------------------
export const dummySessions = [
  {
    _id: "sess_101",
    title: "Sunset Sketching Meetup",
    communityId: "comm_001",
    date: "2025-07-26",
    time: "18:00",
    duration: 120,
    venue: "Fateh Sagar Paal",
    price: 0,
    capacity: 40,
    registeredCount: 28,
    description:
      "Open-air sketching session with fellow artists. Bring your own materials.",
  },
  {
    _id: "sess_102",
    title: "Mindfulness for Students",
    communityId: "comm_002",
    date: "2025-07-27",
    time: "11:00",
    duration: 90,
    venue: "Community Hall, Shobhagpura",
    price: 199,
    capacity: 30,
    registeredCount: 19,
    description:
      "A guided mindfulness and stress-management session for students and young professionals.",
  },
  {
    _id: "sess_103",
    title: "Indie Acoustic Jam",
    communityId: "comm_003",
    date: "2025-07-28",
    time: "19:30",
    duration: 150,
    venue: "Old City Café",
    price: 149,
    capacity: 50,
    registeredCount: 41,
    description:
      "An unplugged jam session featuring local indie musicians and open mic slots.",
  },
  {
    _id: "sess_104",
    title: "Morning Yoga by the Lake",
    communityId: "comm_004",
    date: "2025-07-29",
    time: "06:30",
    duration: 60,
    venue: "Fateh Sagar Lakefront",
    price: 99,
    capacity: 35,
    registeredCount: 22,
    description:
      "Begin your day with a calming yoga flow and guided meditation.",
  },
]