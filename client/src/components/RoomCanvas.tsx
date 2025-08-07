import React from "react";
import { useDrop } from "react-dnd";

export interface FurnitureItem {
    name: string;
    width: number;
    height: number;
    color: string;
    x?: number;
    y?: number;
}

interface RoomCanvasProps {
    width: number;
    height: number;
    placedFurniture: FurnitureItem[];
    onDrop: (item: FurnitureItem, x: number, y: number) => void;
}

export function RoomCanvas({ width, height, placedFurniture, onDrop }: RoomCanvasProps) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "FURNITURE",
        drop: (item: FurnitureItem, monitor) => {
            const offset = monitor.getClientOffset();
            const canvas = document.getElementById("room-canvas");
            if (!offset || !canvas) return;

            const canvasRect = canvas.getBoundingClientRect();
            const x = offset.x - canvasRect.left;
            const y = offset.y - canvasRect.top;
            onDrop(item, x, y);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return drop(
        <div
            id="room-canvas"
            className="relative border bg-gray-100"
            style={{ width, height }}
        >
            {placedFurniture.map((item, idx) => (
                <div
                    key={idx}
                    className="absolute p-1 text-xs text-center text-white"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.width,
                        height: item.height,
                        backgroundColor: item.color,
                        borderRadius: "0.25rem",
                        overflow: "hidden",
                    }}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
}