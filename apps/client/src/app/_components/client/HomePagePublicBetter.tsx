import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBolt, FaHome, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

export default function HomePagePublicBetter() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center bg-[url('/images/hero-bg.jpg')] bg-cover bg-center py-20">
        <div className="mx-auto max-w-2xl rounded-xl bg-white/70 p-10 text-center shadow-xl backdrop-blur-sm">
          <h1 className="mb-4 text-5xl font-extrabold text-primary">
            Find Your Next Dream Home
          </h1>
          <p className="mb-8 text-lg text-gray-700">
            Search thousands of listings, compare neighborhoods, and discover
            your perfect rental, purchase, or event space.
          </p>
          {/* Search Bar */}
          <form className="mx-auto mb-2 flex w-full max-w-xl gap-2">
            <span className="flex items-center rounded-l-lg bg-gray-100 px-3">
              <FaSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="City, Neighborhood, Address, or ZIP"
              className="flex-1 border-b border-t border-gray-300 px-4 py-3 focus:outline-none"
            />
            <select className="border-b border-t border-gray-300 px-4 py-3">
              <option value="rent">For Rent</option>
              <option value="buy">For Sale</option>
              <option value="event">Event Spaces</option>
            </select>
            <button
              type="submit"
              className="rounded-r-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
            >
              Search
            </button>
          </form>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span>Popular:</span>
            <Link href="/neighborhoods/downtown" className="underline">
              Downtown
            </Link>
            <Link href="/neighborhoods/beachfront" className="underline">
              Beachfront
            </Link>
            <Link href="/neighborhoods/uptown" className="underline">
              Uptown
            </Link>
            <Link href="/events" className="underline">
              Events
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">How It Works</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <FaHome className="mb-4 text-4xl text-primary" />
            <h3 className="mb-2 text-lg font-semibold">Browse Listings</h3>
            <p className="text-center text-gray-600">
              Explore a wide range of properties in your desired area.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaMapMarkerAlt className="mb-4 text-4xl text-primary" />
            <h3 className="mb-2 text-lg font-semibold">
              Compare Neighborhoods
            </h3>
            <p className="text-center text-gray-600">
              Use our interactive map and guides to find the best fit for you.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaBolt className="mb-4 text-4xl text-primary" />
            <h3 className="mb-2 text-lg font-semibold">Contact Instantly</h3>
            <p className="text-center text-gray-600">
              Connect with property owners and schedule viewings in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto py-12">
        <h2 className="mb-8 text-2xl font-bold">Featured Properties</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Example cards, map your data here */}
          <div className="overflow-hidden rounded-lg bg-white shadow-lg transition hover:shadow-xl">
            <Image src="/images/property1.jpg" alt="Property" width={500} height={192} className="w-full h-48 object-cover" />
            <div className="p-4">
              <span className="mb-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                New
              </span>
              <h3 className="mb-1 text-lg font-semibold">
                Modern Apartment #1
              </h3>
              <p className="mb-2 text-sm text-gray-500">
                2 Bed • 2 Bath • 1100 sqft
              </p>
              <p className="font-bold text-primary">$2,200/mo</p>
              <Link
                href="/properties/1"
                className="mt-3 block text-primary underline"
              >
                View Details
              </Link>
            </div>
          </div>
          {/* Repeat for more cards */}
        </div>
      </section>

      {/* Map & Neighborhood Guides */}
      <section className="container mx-auto py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">Explore by Map</h3>
            <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-200">
              {/* Replace with interactive map */}
              <span className="text-gray-400">[Map Placeholder]</span>
            </div>
            <Link href="/map" className="mt-4 text-primary underline">
              Open Full Map
            </Link>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Neighborhood Guides</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="font-semibold">Downtown</h4>
                <p className="text-sm text-gray-600">
                  Trendy, walkable, and full of nightlife.
                </p>
                <Link
                  href="/neighborhoods/downtown"
                  className="text-sm text-primary underline"
                >
                  Read Guide
                </Link>
              </div>
              {/* Repeat for more guides */}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/signup">
          <button className="rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-primary/90">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
