import React from "react";

export default function PropertyListingsLink() {
  return (
    <a
      href="/en/property-listings"
      style={{
        display: 'inline-block',
        background: '#059669',
        color: 'white',
        padding: '12px 32px',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 18,
        textDecoration: 'none',
        boxShadow: '0 2px 8px rgba(5,150,105,0.10)',
        transition: 'background 0.2s',
        marginTop: 16,
      }}
      onMouseOver={e => (e.currentTarget.style.background = '#047857')}
      onMouseOut={e => (e.currentTarget.style.background = '#059669')}
    >
      View Property Listings
    </a>
  );
}
