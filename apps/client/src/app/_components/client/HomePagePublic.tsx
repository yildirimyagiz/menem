import React from "react";
import Link from "next/link";
import Image from "next/image";

import SectionHowItWork from "../SectionHowItWork";

export default function HomePagePublic() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero & Search */}
      <section className="relative bg-gradient-to-br from-blue-100 to-white py-16">
        <div className="container mx-auto flex flex-col items-center px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Discover Your Next Home or Investment
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-600">
            Search thousands of listings, compare neighborhoods, and find
            apartments, houses, or event venues that fit your lifestyle.
          </p>
          <form className="mb-6 flex w-full max-w-2xl gap-2">
            <input
              type="text"
              placeholder="City, Neighborhood, Address, or ZIP"
              className="flex-1 rounded-l-lg border border-gray-300 px-4 py-3 focus:outline-none"
            />
            <select
              className="border-b border-t border-gray-300 px-4 py-3"
              defaultValue="rent"
            >
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
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span>Popular: </span>
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
      {/* How It Works - AceternityUI version */}
      <SectionHowItWork />

      {/* Featured Listings */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">
          Featured Properties
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="overflow-hidden rounded-lg bg-white shadow-md"
            >
              <Image
                src={[
                  '/images/cities/San-Francisco-Cityscape-Aerial-Photo.jpg',
                  '/images/cities/Photospots-paris-photographer-flytographer-5.jpeg',
                  '/images/cities/Los-Angeles-Instagrammable-Best-Photo-Spots-Away-Lands-096.jpg',
                  '/images/cities/Kolner-Dom-in-Cologne-Germany.webp',
                ][(id-1)] ?? '/images/cities/San-Francisco-Cityscape-Aerial-Photo.jpg'}
                alt={[
                  'San Francisco Cityscape',
                  'Paris Photospot',
                  'Los Angeles Instagrammable',
                  'Cologne Cathedral, Germany',
                ][(id-1)] ?? 'San Francisco Cityscape'}
                width={500}
                height={192}
                className="h-48 w-full object-cover"
                priority={id === 1}
              />
              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold">
                  Modern Apartment #{id}
                </h3>
                <p className="mb-2 text-gray-500">
                  2 Bed • 2 Bath • 1,100 sqft
                </p>
                <p className="mb-4 font-bold text-primary">$2,200/mo</p>
                <Link
                  href={`/properties/${id}`}
                  className="inline-block rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map & Neighborhood Explorer */}
      <section className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Explore by Map
          </h2>
          <div className="mb-8 flex h-72 w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">
            {/* Replace with Map component */}
            [Map integration coming soon]
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {["Downtown", "Beachfront", "Uptown", "Suburbs"].map((n) => (
              <Link
                key={n}
                href={`/neighborhoods/${n.toLowerCase()}`}
                className="rounded bg-gray-100 px-4 py-2 hover:bg-primary/10"
              >
                {n}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhood Guides */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">
          Neighborhood Guides
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[1, 2, 3].map((id) => (
            <div key={id} className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold">Neighborhood {id}</h3>
              <p className="mb-4 text-gray-500">
                Learn about schools, amenities, and local attractions in this
                area.
              </p>
              <Link
                href={`/neighborhoods/${id}`}
                className="font-semibold text-primary underline"
              >
                Read Guide
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to find your next place?
          </h2>
          <p className="mb-8 text-white">
            Sign up to save your favorite listings, schedule tours, and more.
          </p>
          <Link
            href="/signup"
            className="rounded-lg bg-white px-8 py-3 text-lg font-bold text-primary hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
