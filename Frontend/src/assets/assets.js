import bg from './Bg.png'

export const assets = {
  bg,
}

// ---------------------------------------------
// CATEGORIES (for filtering & discovery)
// ---------------------------------------------
export const categories = [
  {
    id: "following",
    name: "Following",
    icon: "⭐", // shows communities the user follows
  },
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
    isFollowing: true,
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
    isFollowing: false,
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
    isFollowing: true,
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
    isFollowing: false,
  },
  {
    _id: "comm_005",
    name: "Urban Sketchers Udaipur",
    description:
      "Weekly on-location sketch walks capturing the architecture, streets, and daily life of Udaipur.",
    category: "Art & Creativity",
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    logo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    location: "City Palace Area",
    membersCount: 145,
    rating: 4.5,
    isFollowing: false,
  },
  {
    _id: "comm_006",
    name: "Calm Minds Club",
    description:
      "Safe space for stress relief, journaling circles, and guided emotional wellness sessions.",
    category: "Mental Wellness",
    coverImage:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88",
    logo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    location: "University Road",
    membersCount: 190,
    rating: 4.8,
    isFollowing: true,
  },
  {
    _id: "comm_007",
    name: "Sunrise Yoga Tribe",
    description:
      "Early-morning yoga and pranayama sessions focused on flexibility, strength, and breath.",
    category: "Yoga & Meditation",
    coverImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    logo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    location: "Sukhadia Circle",
    membersCount: 275,
    rating: 4.9,
    isFollowing: false,
  },
  {
    _id: "comm_008",
    name: "Indie Film Circle",
    description:
      "Monthly indie film screenings followed by discussions with filmmakers and critics.",
    category: "Art & Creativity",
    coverImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    logo:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    location: "Chetak Circle",
    membersCount: 120,
    rating: 4.4,
    isFollowing: false,
  },
  {
    _id: "comm_009",
    name: "Weekend Hikers Udaipur",
    description:
      "Short hikes, nature walks, and outdoor meetups around Udaipur and nearby hills.",
    category: "Community Meetups",
    coverImage:
      "https://images.unsplash.com/photo-1500534314209-a26db0f5d13c",
    logo:
      "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9",
    location: "Outskirts of Udaipur",
    membersCount: 340,
    rating: 4.7,
    isFollowing: true,
  },
  {
    _id: "comm_010",
    name: "Raahgiri Music Circle",
    description:
      "Street-style music sessions, open mics, and collaborative performances.",
    category: "Music & Performance",
    coverImage:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    logo:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
    location: "Town Hall Road",
    membersCount: 205,
    rating: 4.6,
    isFollowing: false,
  },
  {
    _id: "comm_011",
    name: "Creative Writers Hub",
    description:
      "Storytelling, poetry slams, and feedback-driven writing workshops.",
    category: "Art & Creativity",
    coverImage:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
    logo:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    location: "Ashok Nagar",
    membersCount: 98,
    rating: 4.3,
    isFollowing: false,
  },
  {
    _id: "comm_012",
    name: "Evening Meditation Circle",
    description:
      "Silent meditation and guided relaxation sessions to unwind after work.",
    category: "Yoga & Meditation",
    coverImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    logo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    location: "Saheliyon Ki Bari",
    membersCount: 160,
    rating: 4.8,
    isFollowing: true,
  },
]

// ---------------------------------------------
// SESSIONS / EVENTS DATA (PUBLICLY VIEWABLE)
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
    isPublic: true, // anyone can see this session
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
    isPublic: true,
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
    isPublic: true,
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
    isPublic: true,
  },
]

export const dummyBookings = [
  {
    _id: "book_001",
    sessionId: "sess_101",
    communityId: "comm_001",
    bookingDate: "2025-07-20",
    status: "Confirmed",
  },
  {
    _id: "book_002",
    sessionId: "sess_103",
    communityId: "comm_003",
    bookingDate: "2025-07-22",
    status: "Confirmed",
  },
]