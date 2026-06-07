import { useDrag } from "react-dnd";
import type { FurnitureTemplate } from "../pages/RoomBuilder";

interface DragFurnitureProps {
  item: FurnitureTemplate;
}

export function DragFurniture({ item }: DragFurnitureProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FURNITURE",
    item,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [item]);

  return drag(
    <button
      className="palette-item"
      style={{ opacity: isDragging ? 0.45 : 1 }}
      type="button"
    >
      <span className="palette-shape" style={{ backgroundColor: item.color }}>
        {item.icon}
      </span>
      <span>
        <strong>{item.name}</strong>
        <small>{item.width}" × {item.height}"</small>
      </span>
      <span className="drag-handle" aria-hidden="true">⠿</span>
    </button>,
  );
}
