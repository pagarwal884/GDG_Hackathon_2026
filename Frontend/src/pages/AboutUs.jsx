import React from "react";
import { Users, Globe, Heart, Shield } from "lucide-react";

const AboutUs = () => {
  const values = [
    {
      title: "Local Communities First",
      desc: "Designed specifically for Udaipur’s artists, creative groups, and wellness communities.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Simple & Discoverable",
      desc: "All events and sessions in one place instead of being scattered across WhatsApp and Instagram.",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      title: "Mental & Creative Wellbeing",
      desc: "Supporting spaces that focus on creativity, mindfulness, and human connection.",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      title: "Trust & Authenticity",
      desc: "Communities register themselves and represent real, offline experiences.",
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  return (
    <section className="min-h-screen bg-white px-6 md:px-16 lg:px-24 py-24">
      <div className="max-w-6xl mx-auto space-y-24">

        {/* HEADER */}
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-semibold text-orange-600 uppercase">
            About Local बैठक
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            A simple platform for Udaipur’s local communities
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            Local बैठक is built to help people in Udaipur discover local
            communities, creative groups, and mental-wellness sessions that are
            otherwise hard to find. We bring scattered information into one
            clean, discoverable space.
          </p>
        </div>

        {/* PROBLEM */}
        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            The problem we’re solving
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Many meaningful sessions — art circles, music jams, psychology
            discussions, yoga and mindfulness meetups — are shared only through
            WhatsApp groups, Instagram stories, or word-of-mouth. As a result,
            most people never hear about them.
          </p>
          <p className="text-gray-600 leading-relaxed">
            This limits reach for community organizers and prevents people from
            participating in activities that could genuinely benefit them.
          </p>
        </div>

        {/* SOLUTION */}
        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Our solution
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Local बैठक gives communities a place to register themselves and
            showcase their sessions, meetups, and activities. Users can browse
            communities, explore sessions by category, and discover what’s
            happening around them — all in one platform.
          </p>
          <p className="text-gray-600 leading-relaxed">
            For this hackathon MVP, we focus only on core features: community
            listings, session displays, categories, and basic interaction —
            making the product practical, demoable, and easy to understand.
          </p>
        </div>

        {/* VALUES */}
        <div className="space-y-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            What we stand for
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 space-y-3"
              >
                <div className="text-orange-600">{value.icon}</div>
                <h3 className="font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FUTURE */}
        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Looking ahead
          </h2>
          <p className="text-gray-600 leading-relaxed">
            While this hackathon version focuses on a clean MVP, the platform
            can grow to include features like gamification, live interactions,
            and AI-based recommendations. The goal is to scale responsibly
            without losing the local, human touch.
          </p>
        </div>

        {/* FOOTER NOTE — UNCHANGED */}
        <div className="max-w-3xl mx-auto text-center pt-10">
          <p className="text-lg text-gray-700 italic leading-relaxed">
            "Local बैठक is built with the belief that meaningful conversations and
            connections start locally — and grow from there. Every great community
            begins with a simple 'hello'."
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
