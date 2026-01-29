import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../AuthContext"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Eye,
  LogOut,
  ArrowLeft,
  TrendingUp,
  MapPin,
  Clock,
  X,
  Upload,
  Save,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { db, storage } from "../firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

const Admin = () => {
  const navigate = useNavigate()
  const { user, userType, logout } = useAuth()
  
  const [activeTab, setActiveTab] = useState("dashboard")
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [communityData, setCommunityData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    capacity: 50,
    price: 0,
    category: "",
    coverImage: null,
  })

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    description: "",
    category: "",
    logo: null,
  })

  // Check authentication
  useEffect(() => {
    if (!user || userType !== "community") {
      toast.error("Access denied. Community login required.")
      navigate("/login")
    }
  }, [user, userType, navigate])

  // Fetch community data
  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        // Fetch community profile
        const communityDoc = await getDoc(doc(db, "communities", user.uid))
        if (communityDoc.exists()) {
          const data = communityDoc.data()
          setCommunityData({ id: communityDoc.id, ...data })
          setProfileForm({
            name: data.name || "",
            description: data.description || "",
            category: data.category || "",
            logo: null,
          })
        }

        // Fetch events created by this community
        const eventsQuery = query(
          collection(db, "events"),
          where("communityId", "==", user.uid)
        )
        const eventsSnapshot = await getDocs(eventsQuery)
        const eventsData = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setEvents(eventsData)

        // Fetch registrations for community events
        const eventIds = eventsData.map((e) => e.id)
        if (eventIds.length > 0) {
          const registrationsQuery = query(
            collection(db, "registrations"),
            where("eventId", "in", eventIds)
          )
          const registrationsSnapshot = await getDocs(registrationsQuery)
          const registrationsData = registrationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setRegistrations(registrationsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [user])

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/login", { replace: true })
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  // Handle create/update event
  const handleSaveEvent = async (e) => {
    e.preventDefault()
    
    try {
      let coverImageUrl = editingEvent?.coverImage || communityData?.coverImage || ""

      // Upload cover image if provided
      if (eventForm.coverImage) {
        const imageRef = ref(
          storage,
          `event-covers/${Date.now()}_${eventForm.coverImage.name}`
        )
        await uploadBytes(imageRef, eventForm.coverImage)
        coverImageUrl = await getDownloadURL(imageRef)
      }

      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        venue: eventForm.venue,
        capacity: Number(eventForm.capacity),
        price: Number(eventForm.price),
        category: eventForm.category,
        coverImage: coverImageUrl,
        communityId: user.uid,
        communityName: communityData?.name || "",
        registeredCount: editingEvent?.registeredCount || 0,
        updatedAt: new Date().toISOString(),
      }

      if (editingEvent) {
        // Update existing event
        await updateDoc(doc(db, "events", editingEvent.id), eventData)
        setEvents(events.map((e) => (e.id === editingEvent.id ? { ...e, ...eventData } : e)))
        toast.success("Event updated successfully")
      } else {
        // Create new event
        const docRef = await addDoc(collection(db, "events"), {
          ...eventData,
          createdAt: new Date().toISOString(),
        })
        setEvents([...events, { id: docRef.id, ...eventData }])
        toast.success("Event created successfully")
      }

      setShowEventModal(false)
      setEditingEvent(null)
      resetEventForm()
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error("Failed to save event")
    }
  }

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return

    try {
      await deleteDoc(doc(db, "events", eventId))
      setEvents(events.filter((e) => e.id !== eventId))
      toast.success("Event deleted successfully")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    }
  }

  // Handle update community profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    try {
      let logoUrl = communityData?.logo || ""

      // Upload logo if provided
      if (profileForm.logo) {
        const logoRef = ref(
          storage,
          `community-logos/${Date.now()}_${profileForm.logo.name}`
        )
        await uploadBytes(logoRef, profileForm.logo)
        logoUrl = await getDownloadURL(logoRef)
      }

      const profileData = {
        name: profileForm.name,
        description: profileForm.description,
        category: profileForm.category,
        logo: logoUrl,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(doc(db, "communities", user.uid), profileData)
      setCommunityData({ ...communityData, ...profileData })
      toast.success("Profile updated successfully")
      setShowProfileModal(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    }
  }

  // Reset event form
  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      capacity: 50,
      price: 0,
      category: "",
      coverImage: null,
    })
  }

  // Open edit modal
  const openEditModal = (event) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      venue: event.venue,
      capacity: event.capacity,
      price: event.price,
      category: event.category,
      coverImage: null,
    })
    setShowEventModal(true)
  }

  // Calculate stats
  const totalEvents = events.length
  const totalRegistrations = registrations.length
  const upcomingEvents = events.filter(
    (e) => new Date(e.date) >= new Date()
  ).length
  const totalRevenue = registrations.reduce(
    (sum, reg) => {
      const event = events.find((e) => e.id === reg.eventId)
      return sum + (event?.price || 0)
    },
    0
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold tracking-tight text-black">
                Local
              </span>
              <span className="text-3xl font-bold text-orange-600 tracking-tight">
                बैठक
              </span>
            </div>
          </div>

          {/* Community Info */}
          <div className="mb-8 p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              {communityData?.logo ? (
                <img
                  src={communityData.logo}
                  alt={communityData.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                  {communityData?.name?.charAt(0) || "C"}
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                  {communityData?.name || "Community"}
                </p>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === "dashboard"
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("events")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === "events"
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Calendar size={20} />
              Events
            </button>

            <button
              onClick={() => setActiveTab("registrations")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === "registrations"
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users size={20} />
              Registrations
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === "settings"
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings size={20} />
              Settings
            </button>
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "events" && "Manage Events"}
                {activeTab === "registrations" && "Registrations"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-gray-600">
                {activeTab === "dashboard" && "Overview of your community performance"}
                {activeTab === "events" && "Create and manage your events"}
                {activeTab === "registrations" && "View all event registrations"}
                {activeTab === "settings" && "Update your community profile"}
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={18} />
              Back to Site
            </button>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-gray-600 text-sm mb-1">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-orange-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-gray-600 text-sm mb-1">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900">{upcomingEvents}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-gray-600 text-sm mb-1">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-900">{totalRegistrations}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{totalRevenue}</p>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Events</h2>
              <div className="space-y-3">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={event.coverImage || communityData?.coverImage || "https://via.placeholder.com/60"}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-600">
                          {event.date} • {event.registeredCount || 0}/{event.capacity} registered
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">
                      {event.price === 0 ? "Free" : `₹${event.price}`}
                    </span>
                  </div>
                ))}

                {events.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No events created yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  resetEventForm()
                  setEditingEvent(null)
                  setShowEventModal(true)
                }}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                <Plus size={20} />
                Create Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={event.coverImage || communityData?.coverImage || "https://via.placeholder.com/400x200"}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {event.venue}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        {event.registeredCount || 0}/{event.capacity} registered
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(event)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {events.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No events yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first event to start engaging with your community
                </p>
                <button
                  onClick={() => {
                    resetEventForm()
                    setEditingEvent(null)
                    setShowEventModal(true)
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  <Plus size={20} />
                  Create Event
                </button>
              </div>
            )}
          </div>
        )}

        {/* REGISTRATIONS TAB */}
        {activeTab === "registrations" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Participant
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.map((registration) => {
                    const event = events.find((e) => e.id === registration.eventId)
                    return (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {registration.userName || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {registration.userEmail || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{event?.title || "Unknown Event"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{event?.date || "N/A"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{registration.phone || "N/A"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {registrations.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No registrations yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Community Profile</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  {communityData?.logo ? (
                    <img
                      src={communityData.logo}
                      alt={communityData.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold">
                      {communityData?.name?.charAt(0) || "C"}
                    </div>
                  )}
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Change Logo
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community Name
                  </label>
                  <p className="text-gray-900">{communityData?.name || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900">{communityData?.email || user?.email || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <p className="text-gray-900">{communityData?.description || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <p className="text-gray-900 capitalize">{communityData?.category || "N/A"}</p>
                </div>

                <button
                  onClick={() => setShowProfileModal(true)}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button
                onClick={() => {
                  setShowEventModal(false)
                  setEditingEvent(null)
                  resetEventForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, capacity: e.target.value })
                    }
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="tech">Technology</option>
                  <option value="design">Design</option>
                  <option value="startup">Startup</option>
                  <option value="education">Education</option>
                  <option value="wellness">Wellness</option>
                  <option value="art">Art & Culture</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEventForm({ ...eventForm, coverImage: e.target.files[0] })
                  }
                  className="w-full text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use community cover image
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false)
                    setEditingEvent(null)
                    resetEventForm()
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Name *
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={profileForm.description}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={profileForm.category}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="tech">Technology</option>
                  <option value="design">Design</option>
                  <option value="startup">Startup</option>
                  <option value="education">Education</option>
                  <option value="wellness">Wellness</option>
                  <option value="art">Art & Culture</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, logo: e.target.files[0] })
                  }
                  className="w-full text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin