import { useRef } from "react";
import { useDrop } from "react-dnd";
import type { FurnitureItem, FurnitureTemplate } from "../pages/RoomBuilder";

interface RoomCanvasProps {
  width: number;
  height: number;
  placedFurniture: FurnitureItem[];
  selectedId: string | null;
  onDrop: (item: FurnitureTemplate, x: number, y: number) => void;
  onMove: (id: string, x: number, y: number) => void;
  onSelect: (id: string | null) => void;
}

export function RoomCanvas({
  width,
  height,
  placedFurniture,
  selectedId,
  onDrop,
  onMove,
  onSelect,
}: RoomCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [, drop] = useDrop(() => ({
    accept: "FURNITURE",
    drop: (item: FurnitureTemplate, monitor) => {
      const offset = monitor.getClientOffset();
      const canvas = canvasRef.current;
      if (!offset || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      onDrop(item, offset.x - rect.left - item.width / 2, offset.y - rect.top - item.height / 2);
    },
  }), [onDrop]);

  const attachCanvas = (node: HTMLDivElement | null) => {
    canvasRef.current = node;
    drop(node);
  };

  const startMoving = (event: React.PointerEvent, item: FurnitureItem) => {
    event.stopPropagation();
    onSelect(item.id);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const originX = item.x;
    const originY = item.y;
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);

    const move = (moveEvent: PointerEvent) => {
      onMove(item.id, originX + moveEvent.clientX - startX, originY + moveEvent.clientY - startY);
    };
    const stop = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", stop);
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", stop);
  };

  return (
    <div className="canvas-scroll">
      <div
        className="room-canvas"
        onPointerDown={() => onSelect(null)}
        ref={attachCanvas}
        style={{ width, height }}
      >
        <span className="dimension dimension-width">{Math.round(width / 40)} ft</span>
        <span className="dimension dimension-height">{Math.round(height / 40)} ft</span>
        <div className="door-swing" />
        {placedFurniture.map((item) => {
          const itemWidth = item.rotated ? item.height : item.width;
          const itemHeight = item.rotated ? item.width : item.height;
          return (
            <button
              className={`placed-item ${selectedId === item.id ? "selected" : ""}`}
              key={item.id}
              onPointerDown={(event) => startMoving(event, item)}
              style={{
                left: item.x,
                top: item.y,
                width: itemWidth,
                height: itemHeight,
                backgroundColor: item.color,
              }}
              type="button"
            >
              <span>{item.icon}</span>
              <small>{item.name}</small>
            </button>
          );
        })}
        {placedFurniture.length === 0 && (
          <div className="canvas-empty">
            <span>+</span>
            <p>Drag furniture here</p>
          </div>
        )}
      </div>
    </div>
  );
}
