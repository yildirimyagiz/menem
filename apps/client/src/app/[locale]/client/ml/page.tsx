import React from 'react';
import Link from 'next/link';

export default function MLMainPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">ML Analytics & Features</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/client/ml/analytics-dashboard" className="text-blue-600 underline">Analytics Dashboard</Link>
        </li>
        <li>
          <Link href="/client/ml/photo-analytics" className="text-blue-600 underline">Per-Photo ML Analytics</Link>
        </li>
        <li>
          <Link href="/client/ml/config" className="text-blue-600 underline">ML Configuration (Admin)</Link>
        </li>
        <li>
          <Link href="/client/ml/feedback" className="text-blue-600 underline">User Feedback on ML Results</Link>
        </li>
        <li>
          <Link href="/client/ml/search" className="text-blue-600 underline">ML-Powered Smart Search</Link>
        </li>
      </ul>
    </div>
  );
}
