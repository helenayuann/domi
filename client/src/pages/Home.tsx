import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Home() {
    const location = useLocation();

    const navItems = [
        { name: "Moodboard", path: "/moodboard" },
        { name: "Room Builder", path: "/roombuilder" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Top Nav Bar */}
            <nav className="bg-white shadow-md w-full">
                <div className="max-w-6xl mx-auto px-4">
                    <ul className="flex space-x-8 py-4">
                        {navItems.map(({ name, path }) => (
                            <li key={path}>
                                <Link
                                    to={path}
                                    className={`text-lg font-semibold ${
                                        location.pathname === path
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-700 hover:text-blue-600"
                                    }`}
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex flex-col items-center justify-center flex-grow px-4 text-center">
                <h1 className="text-5xl font-extrabold mb-6 text-gray-900 mt-16">
                    Domi
                </h1>
                <p className="text-lg text-gray-700 mb-8 max-w-md mx-auto">
                    Meet Domi. Your personal room design assistant.
                </p>
                <Link
                    to="/moodboard"
                    className="px-8 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition"
                >
                    Start Designing →
                </Link>
            </main>
        </div>
    );
}
