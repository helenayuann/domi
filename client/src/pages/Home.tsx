import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
        Domi
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-md text-center">
        Meet Domi. Your personal room design assistant.
      </p>
      {/* <a
        href="/moodboard"
        className="px-8 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition"
      >
        Start Designing →
      </a> */}
    </div>
  );
}