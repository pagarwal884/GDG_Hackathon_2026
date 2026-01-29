/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react"
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
  MapPin,
  Clock,
  X,
  Upload,
  Save,
  DollarSign,
  CheckCircle,
  Download,
  Filter,
  Search,
  Shield,
  Globe,
  Phone,
  Mail,
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
  serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { format, parseISO, isPast, isToday, isFuture } from "date-fns"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    totalRevenue: 0,
    registrationRate: 0,
    averageAttendance: 0,
  })

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    capacity: 50,
    price: 0,
    category: "tech",
    coverImage: null,
    tags: [],
  })

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    description: "",
    category: "",
    logo: null,
    contactEmail: "",
    contactPhone: "",
    website: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
  })

  // Check authentication
  useEffect(() => {
    if (!user || userType !== "community") {
      toast.error("Access denied. Community login required.")
      navigate("/login")
    }
  }, [user, userType, navigate])

  // Fetch community data
  const fetchCommunityData = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Fetch community profile
      const communityDoc = await getDoc(doc(db, "communities", user.uid))
      if (communityDoc.exists()) {
        const data = communityDoc.data()
        setCommunityData({ 
          id: communityDoc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date()
        })
        setProfileForm({
          name: data.name || "",
          description: data.description || "",
          category: data.category || "",
          logo: null,
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          website: data.website || "",
          socialLinks: data.socialLinks || {
            facebook: "",
            instagram: "",
            twitter: "",
          },
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
        date: doc.data().date,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }))
      
      // Sort events by date (upcoming first)
      const sortedEvents = eventsData.sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      )
      setEvents(sortedEvents)

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
          registeredAt: doc.data().registeredAt?.toDate?.() || new Date(),
        }))
        setRegistrations(registrationsData)
        
        // Calculate statistics
        calculateStats(eventsData, registrationsData)
      } else {
        calculateStats(eventsData, [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCommunityData()
  }, [fetchCommunityData])

  // Calculate statistics
  const calculateStats = (eventsData, registrationsData) => {
    const totalEvents = eventsData.length
    const totalRegistrations = registrationsData.length
    const upcomingEvents = eventsData.filter(e => isFuture(parseISO(e.date))).length
    const totalRevenue = registrationsData.reduce((sum, reg) => {
      const event = eventsData.find(e => e.id === reg.eventId)
      return sum + (event?.price || 0)
    }, 0)
    
    const registrationRate = totalEvents > 0 
      ? (totalRegistrations / (eventsData.reduce((sum, e) => sum + e.capacity, 0))) * 100 
      : 0
    
    const averageAttendance = totalEvents > 0 
      ? (totalRegistrations / totalEvents) 
      : 0

    setStats({
      totalEvents,
      totalRegistrations,
      upcomingEvents,
      totalRevenue,
      registrationRate: Math.round(registrationRate),
      averageAttendance: Math.round(averageAttendance),
    })
  }

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
        title: eventForm.title.trim(),
        description: eventForm.description.trim(),
        date: eventForm.date,
        time: eventForm.time,
        venue: eventForm.venue.trim(),
        capacity: Number(eventForm.capacity),
        price: Number(eventForm.price),
        category: eventForm.category,
        tags: eventForm.tags,
        coverImage: coverImageUrl,
        communityId: user.uid,
        communityName: communityData?.name || "",
        registeredCount: editingEvent?.registeredCount || 0,
        updatedAt: serverTimestamp(),
      }

      if (editingEvent) {
        // Update existing event
        await updateDoc(doc(db, "events", editingEvent.id), eventData)
        setEvents(events.map((e) => 
          e.id === editingEvent.id ? { ...e, ...eventData } : e
        ))
        toast.success("Event updated successfully")
      } else {
        // Create new event
        const docRef = await addDoc(collection(db, "events"), {
          ...eventData,
          createdAt: serverTimestamp(),
        })
        setEvents([...events, { id: docRef.id, ...eventData }])
        toast.success("Event created successfully")
      }

      setShowEventModal(false)
      setEditingEvent(null)
      resetEventForm()
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error(error.message || "Failed to save event")
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
        name: profileForm.name.trim(),
        description: profileForm.description.trim(),
        category: profileForm.category,
        logo: logoUrl,
        contactEmail: profileForm.contactEmail.trim(),
        contactPhone: profileForm.contactPhone.trim(),
        website: profileForm.website.trim(),
        socialLinks: profileForm.socialLinks,
        updatedAt: serverTimestamp(),
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
      category: "tech",
      coverImage: null,
      tags: [],
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
      tags: event.tags || [],
    })
    setShowEventModal(true)
  }

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Get event status
  const getEventStatus = (eventDate) => {
    const date = parseISO(eventDate)
    if (isPast(date)) return "past"
    if (isToday(date)) return "today"
    return "upcoming"
  }

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "past": return "bg-gray-100 text-gray-700"
      case "today": return "bg-blue-100 text-blue-700"
      case "upcoming": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy")
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            <span className="text-xl font-bold text-gray-900">Local</span>
            <span className="text-xl font-bold text-orange-600">बैठक</span>
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">
              ADMIN
            </span>
          </div>

          {/* Community Info */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              {communityData?.logo ? (
                <img
                  src={communityData.logo}
                  alt={communityData.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-orange-500 text-white flex items-center justify-center font-semibold">
                  {communityData?.name?.charAt(0) || "C"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {communityData?.name || "Community"}
                </p>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 mb-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "events", label: "Events", icon: Calendar },
              { id: "registrations", label: "Registrations", icon: Users },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors border border-red-200"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "events" && "Events"}
                {activeTab === "registrations" && "Registrations"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-gray-600 text-sm">
                {activeTab === "dashboard" && "Overview of your community"}
                {activeTab === "events" && "Manage your events"}
                {activeTab === "registrations" && "View participant registrations"}
                {activeTab === "settings" && "Update your community profile"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-white rounded-lg transition-colors border border-gray-200"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
              </button>
              {activeTab === "events" && (
                <button
                  onClick={() => {
                    resetEventForm()
                    setEditingEvent(null)
                    setShowEventModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus size={18} />
                  <span className="text-sm font-medium">Create Event</span>
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          {(activeTab === "events" || activeTab === "registrations") && (
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={18} />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={18} />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          )}
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Events",
                  value: stats.totalEvents,
                  icon: Calendar,
                },
                {
                  label: "Upcoming Events",
                  value: stats.upcomingEvents,
                  icon: Clock,
                },
                {
                  label: "Total Registrations",
                  value: stats.totalRegistrations,
                  icon: Users,
                },
                {
                  label: "Total Revenue",
                  value: `₹${stats.totalRevenue}`,
                  icon: DollarSign,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
                  <button
                    onClick={() => setActiveTab("events")}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {events.slice(0, 5).map((event) => {
                  const status = getEventStatus(event.date)
                  return (
                    <div
                      key={event.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"}
                            alt={event.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900">{event.title}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(status)}`}>
                                {status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{formatDate(event.date)} • {event.time}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-gray-600">
                                <MapPin size={14} />
                                {event.venue}
                              </span>
                              <span className="flex items-center gap-1 text-gray-600">
                                <Users size={14} />
                                {event.registeredCount || 0}/{event.capacity}
                              </span>
                              <span className={`font-medium ${event.price === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                {event.price === 0 ? "Free" : `₹${event.price}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {events.length === 0 && (
                  <div className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No events yet</p>
                    <p className="text-sm text-gray-500 mb-6">Create your first event</p>
                    <button
                      onClick={() => {
                        resetEventForm()
                        setEditingEvent(null)
                        setShowEventModal(true)
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Plus size={18} />
                      Create Event
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === "events" && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {["all", "tech", "design", "startup", "education", "wellness", "art", "other"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const status = getEventStatus(event.date)
                const progress = ((event.registeredCount || 0) / event.capacity) * 100
                
                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          event.price === 0 
                            ? "bg-green-100 text-green-700" 
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {event.price === 0 ? "FREE" : `₹${event.price}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="mb-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-2">
                          {event.category}
                        </span>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Registrations</span>
                          <span className="font-medium text-gray-900">
                            {event.registeredCount || 0}/{event.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-orange-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => openEditModal(event)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first event to get started
                </p>
                <button
                  onClick={() => {
                    resetEventForm()
                    setEditingEvent(null)
                    setShowEventModal(true)
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Registrations</h2>
                  <p className="text-gray-600 text-sm">All participant registrations</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg font-medium text-sm">
                  {registrations.length} Total
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {registrations.map((registration) => {
                    const event = events.find((e) => e.id === registration.eventId)
                    return (
                      <tr 
                        key={registration.id} 
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-semibold">
                              {registration.userName?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {registration.userName || "N/A"}
                              </p>
                              <p className="text-xs text-gray-600">
                                {registration.userEmail || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 text-sm">{event?.title || "Unknown"}</p>
                          <p className="text-xs text-gray-600">
                            {event?.price === 0 ? "Free" : `₹${event?.price}`}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900 text-sm">{event?.date ? formatDate(event.date) : "N/A"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-gray-900 text-sm">{registration.phone || "N/A"}</p>
                            <p className="text-xs text-gray-600">{registration.userEmail || "N/A"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                            <CheckCircle size={12} />
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {registrations.length === 0 && (
                <div className="p-16 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No registrations yet</h3>
                  <p className="text-gray-600 mb-6">
                    Registrations will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Community Profile</h2>
                <p className="text-gray-600 text-sm">Manage your community information</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    {communityData?.logo ? (
                      <img
                        src={communityData.logo}
                        alt={communityData.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-orange-500 text-white flex items-center justify-center text-2xl font-semibold">
                        {communityData?.name?.charAt(0) || "C"}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{communityData?.name || "N/A"}</h3>
                      <p className="text-sm text-gray-600 mb-3">{communityData?.category || "N/A"}</p>
                      <button
                        onClick={() => setShowProfileModal(true)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-gray-900">{communityData?.contactEmail || user?.email || "N/A"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                      <p className="text-gray-900">{communityData?.contactPhone || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
                      <p className="text-gray-900">
                        {communityData?.website ? (
                          <a 
                            href={communityData.website.startsWith('http') ? communityData.website : `https://${communityData.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700"
                          >
                            {communityData.website}
                          </a>
                        ) : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Member Since</label>
                      <p className="text-gray-900">
                        {communityData?.createdAt ? format(communityData.createdAt, "MMM yyyy") : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <p className="text-gray-900">
                      {communityData?.description || "No description provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h2>
              <button
                onClick={() => {
                  setShowEventModal(false)
                  setEditingEvent(null)
                  resetEventForm()
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    required
                  >
                    <option value="tech">Technology</option>
                    <option value="design">Design</option>
                    <option value="startup">Startup</option>
                    <option value="education">Education</option>
                    <option value="wellness">Wellness</option>
                    <option value="art">Art & Culture</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-3">Upload cover image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEventForm({ ...eventForm, coverImage: e.target.files[0] })
                    }
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors cursor-pointer text-sm"
                  >
                    Choose File
                  </label>
                </div>
                {eventForm.coverImage && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {eventForm.coverImage.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false)
                    setEditingEvent(null)
                    resetEventForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                >
                  {editingEvent ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  {communityData?.logo ? (
                    <img
                      src={communityData.logo}
                      alt={communityData.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xl font-semibold">
                      {communityData?.name?.charAt(0) || "C"}
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, logo: e.target.files[0] })
                      }
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors cursor-pointer text-sm"
                    >
                      Change Logo
                    </label>
                    {profileForm.logo && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {profileForm.logo.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={profileForm.category}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    required
                  >
                    <option value="">Select</option>
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.contactEmail}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, contactEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileForm.contactPhone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, contactPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, website: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
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