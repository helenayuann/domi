import React, { useState } from "react";
import { DragFurniture } from "../components/DragFurniture";
import { RoomCanvas } from "../components/RoomCanvas";

export interface FurnitureItem {
    name: string;
    width: number;
    height: number;
    color: string;
    x?: number;
    y?: number;
}

const FURNITURE_PRESETS: FurnitureItem[] = [
    { name: "Bed", width: 80, height: 60, color: "#fca5a5" },
    { name: "Desk", width: 60, height: 30, color: "#fdba74" },
    { name: "Chair", width: 20, height: 20, color: "#bbf7d0" },
    { name: "Dresser", width: 40, height: 20, color: "#93c5fd" },
];

export default function RoomBuilderPage() {
    const [roomWidth, setRoomWidth] = useState(600);
    const [roomHeight, setRoomHeight] = useState(400);
    const [placedFurniture, setPlacedFurniture] = useState<FurnitureItem[]>([]);

    const handleDrop = (item: FurnitureItem, x: number, y: number) => {
        // Check for overlap here (optional)
        setPlacedFurniture((prev) => [...prev, { ...item, x, y }]);
    };

    return (
        <div className="flex gap-4 p-6">
            <div className="w-1/4">
                <h2 className="text-xl font-bold mb-4">Furniture Palette</h2>
                {FURNITURE_PRESETS.map((item) => (
                    <DragFurniture key={item.name} item={item} />
                ))}
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Room Layout</h2>
                <RoomCanvas
                    width={roomWidth}
                    height={roomHeight}
                    placedFurniture={placedFurniture}
                    onDrop={handleDrop}
                />
            </div>
        </div>
    );
}
