import React, { useState } from "react"
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  XCircle,
} from "lucide-react"
import { jsPDF } from "jspdf"
import QRCode from "qrcode"
import toast from "react-hot-toast"
import {
  dummyBookings,
  dummySessions,
  dummyCommunities,
} from "../assets/assets"

const Booking = () => {
  const [bookings, setBookings] = useState(dummyBookings)

  /* ---------- MERGE DATA ---------- */
  const bookingsWithDetails = bookings.map((booking) => {
    const session = dummySessions.find(
      (s) => s._id === booking.sessionId
    )
    const community = dummyCommunities.find(
      (c) => c._id === booking.communityId
    )

    return { ...booking, session, community }
  })

  /* ---------- CANCEL TICKET ---------- */
  const handleCancel = (id) => {
    if (!window.confirm("Cancel this ticket?")) return

    // mark cancelled first (for PDF history)
    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: "Cancelled" } : b
      )
    )

    toast.success("Ticket cancelled")

    // remove card after short delay
    setTimeout(() => {
      setBookings((prev) => prev.filter((b) => b._id !== id))
    }, 600)
  }

  /* ---------- DOWNLOAD PDF ---------- */
  const handleDownloadPDF = async (booking) => {
    const doc = new jsPDF()

    /* HEADER */
    doc.setFont("helvetica", "bold")
    doc.setFontSize(26)
    doc.text("EVENT TICKET", 105, 25, { align: "center" })
    doc.line(20, 32, 190, 32)

    /* QR DATA */
    const qrData = `
Event: ${booking.session?.title}
Community: ${booking.community?.name}
Date: ${booking.session?.date}
Time: ${booking.session?.time}
Venue: ${booking.session?.venue}
Ticket ID: ${booking._id}
Status: ${booking.status}
    `
    const qrImage = await QRCode.toDataURL(qrData)

    /* BODY */
    doc.setFontSize(12)
    let y = 48

    const rows = [
      ["Event", booking.session?.title],
      ["Community", booking.community?.name],
      ["Date", booking.session?.date],
      ["Time", booking.session?.time],
      ["Venue", booking.session?.venue],
      ["Status", booking.status],
    ]

    rows.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold")
      doc.text(`${label}:`, 20, y)
      doc.setFont("helvetica", "normal")
      doc.text(value || "-", 70, y)
      y += 10
    })

    /* QR */
    doc.addImage(qrImage, "PNG", 140, 48, 40, 40)
    doc.setFontSize(10)
    doc.text("Scan at Entry", 148, 93)

    /* WATERMARK FOR CANCELLED */
    if (booking.status === "Cancelled") {
      doc.setFontSize(60)
      doc.setTextColor(200, 0, 0)
      doc.setFont("helvetica", "bold")
      doc.text("CANCELLED", 105, 160, {
        align: "center",
        angle: 45,
      })
      doc.setTextColor(0)
    }

    /* FOOTER */
    doc.setFontSize(10)
    doc.text(
      "This ticket is valid only for the registered attendee.",
      20,
      190
    )

    doc.save(`ticket-${booking._id}.pdf`)
    toast.success("Ticket downloaded")
  }

  return (
    <section className="bg-orange-50 min-h-screen border-t border-black/10">
      {/* HEADER */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-24 pb-12">
        <h2 className="text-xl font-semibold text-black">
          My Tickets
        </h2>
        <p className="text-gray-600 max-w-xl mt-2">
          Download your ticket and scan it at the venue.
        </p>
      </div>

      {/* LIST */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pb-24 space-y-6">
        {bookingsWithDetails.map((booking) => (
          <div
            key={booking._id}
            className="bg-white border border-black/10 rounded-2xl p-6
                       flex flex-col md:flex-row justify-between gap-8
                       hover:shadow-lg transition"
          >
            {/* LEFT */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {booking.session?.title}
              </h3>

              <p className="text-sm text-gray-600">
                Hosted by{" "}
                <span className="font-medium text-black">
                  {booking.community?.name}
                </span>
              </p>

              <div className="flex flex-wrap gap-5 text-sm">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {booking.session?.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {booking.session?.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {booking.session?.venue}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-row md:flex-col gap-3 md:items-end">
              <button
                onClick={() => handleDownloadPDF(booking)}
                className="cursor-pointer flex items-center gap-2 px-5 py-2.5
                           rounded-lg bg-orange-600 text-white
                           hover:bg-orange-700 transition"
              >
                <Download size={16} />
                Download
              </button>

              <button
                onClick={() => handleCancel(booking._id)}
                className="cursor-pointer flex items-center gap-2 px-5 py-2.5
                           rounded-lg border border-red-200
                           text-red-600 hover:bg-red-50 transition"
              >
                <XCircle size={16} />
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Booking
