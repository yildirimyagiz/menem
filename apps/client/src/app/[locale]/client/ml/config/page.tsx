import React from 'react';

export default function MLConfigAdminPage() {
  // Placeholder: ML configuration controls for admin
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">ML Configuration (Admin)</h2>
      <div className="bg-gray-100 rounded-lg p-6">
        <p className="mb-2">Configure ML features and thresholds:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Enable/disable auto-tagging</li>
          <li>Set quality thresholds</li>
          <li>Select allowed ML models</li>
        </ul>
        <div className="text-gray-500">(Configuration UI coming soon)</div>
      </div>
    </div>
  );
}
