import React from "react";
import { generateMoodboard, test } from "../endpoints/moodboard";
import { useState } from "react";

const VIBE_OPTIONS = ["minimalist", "cozy", "boho", "modern", "vintage"];
const ROOM_OPTIONS = ["bedroom", "living room", "kitchen", "office", "bathroom"];

export function Moodboard() {
    const [images, setImages] = useState<string[]>([])
    const [vibe, setVibe] = useState<string>("Minimalist")
    const [roomType, setRoomType] = useState<string>("Bedroom")

    const handleGeneration = (vibe: string, roomType: string) => {
        generateMoodboard(vibe, roomType).then(async response => {
            const moodboard = await response.json()
            console.log(vibe)
            console.log(roomType)
            setImages(moodboard)
        })
    }

    return (
        <div className="p-4">
            <form onSubmit={(e) => {
                e.preventDefault();
                handleGeneration(vibe, roomType);
            }} className="space-y-4 bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto">
                <div>
                    <label className="block mb-1 font-semibold">Vibe</label>
                    <select value={vibe} onChange={(e) => setVibe(e.target.value)} className="w-full border p-2 rounded-lg">
                    {VIBE_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Room Type</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full border p-2 rounded-lg">
                    {ROOM_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                        </option>
                    ))}
                    </select>
                </div>

                <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                    Generate Moodboard
                </button>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {images?.map((url, index) => (
                    <div key={index} className="h-48 overflow-hidden rounded-xl shadow">
                    <img
                        src={url}
                        alt={`Moodboard ${index}`}
                        className="w-full h-full object-cover"
                    />
                    </div>
                ))}
            </div>
        </div>
    );
}