import React from "react";
import { useDrag } from "react-dnd";

export interface FurnitureItem {
    name: string;
    width: number;
    height: number;
    color: string;
    x?: number;
    y?: number;
}

interface DragFurnitureProps {
    item: FurnitureItem;
}

export function DragFurniture({ item }: DragFurnitureProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "FURNITURE",
        item,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return drag(
        <div
            className="cursor-move p-2 rounded shadow text-white text-xs text-center"
            style={{
                opacity: isDragging ? 0.5 : 1,
                backgroundColor: item.color,
                width: item.width,
                height: item.height,
                marginBottom: "0.5rem",
            }}
        >
            {item.name}
        </div>
    );    
}
