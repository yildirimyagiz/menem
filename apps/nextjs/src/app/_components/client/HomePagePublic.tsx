import React from "react";
import Link from "next/link";

export default function HomePagePublic() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero & Search */}
      <section className="relative bg-gradient-to-br from-blue-100 to-white py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next Home or Investment
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Search thousands of listings, compare neighborhoods, and find apartments, houses, or event venues that fit your lifestyle.
          </p>
          <form className="w-full max-w-2xl flex gap-2 mb-6">
            <input
              type="text"
              placeholder="City, Neighborhood, Address, or ZIP"
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none"
            />
            <select
              className="px-4 py-3 border-t border-b border-gray-300"
              defaultValue="rent"
            >
              <option value="rent">For Rent</option>
              <option value="buy">For Sale</option>
              <option value="event">Event Spaces</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-r-lg hover:bg-primary/90"
            >
              Search
            </button>
          </form>
          <div className="flex flex-wrap gap-3 justify-center text-sm text-gray-500">
            <span>Popular: </span>
            <Link href="/neighborhoods/downtown" className="underline">Downtown</Link>
            <Link href="/neighborhoods/beachfront" className="underline">Beachfront</Link>
            <Link href="/neighborhoods/uptown" className="underline">Uptown</Link>
            <Link href="/events" className="underline">Events</Link>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`/images/property${id}.jpg`}
                alt={`Property ${id}`}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Modern Apartment #{id}</h3>
                <p className="text-gray-500 mb-2">2 Bed • 2 Bath • 1,100 sqft</p>
                <p className="font-bold text-primary mb-4">$2,200/mo</p>
                <Link
                  href={`/properties/${id}`}
                  className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map & Neighborhood Explorer */}
      <section className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Explore by Map</h2>
          <div className="w-full h-72 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-8">
            {/* Replace with Map component */}
            [Map integration coming soon]
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Downtown", "Beachfront", "Uptown", "Suburbs"].map((n) => (
              <Link
                key={n}
                href={`/neighborhoods/${n.toLowerCase()}`}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-primary/10"
              >
                {n}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhood Guides */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Neighborhood Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((id) => (
            <div key={id} className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Neighborhood {id}</h3>
              <p className="text-gray-500 mb-4">
                Learn about schools, amenities, and local attractions in this area.
              </p>
              <Link
                href={`/neighborhoods/${id}`}
                className="text-primary font-semibold underline"
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
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find your next place?
          </h2>
          <p className="text-white mb-8">
            Sign up to save your favorite listings, schedule tours, and more.
          </p>
          <Link
            href="/signup"
            className="px-8 py-3 bg-white text-primary font-bold rounded-lg text-lg hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
