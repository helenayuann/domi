import { useEffect, useMemo, useState } from "react";
import { DragFurniture } from "../components/DragFurniture";
import { RoomCanvas } from "../components/RoomCanvas";
import { importFurniture } from "../endpoints/moodboard";

export interface FurnitureTemplate {
  name: string;
  width: number;
  height: number;
  color: string;
  icon: string;
}

export interface FurnitureItem extends FurnitureTemplate {
  id: string;
  x: number;
  y: number;
  rotated: boolean;
}

const FURNITURE_PRESETS: FurnitureTemplate[] = [
  { name: "Sofa", width: 150, height: 64, color: "#bdc5ad", icon: "▰" },
  { name: "Armchair", width: 68, height: 68, color: "#d9b49b", icon: "◼" },
  { name: "Coffee table", width: 88, height: 48, color: "#bda98f", icon: "▭" },
  { name: "Floor lamp", width: 38, height: 38, color: "#e4c986", icon: "●" },
  { name: "Bed", width: 128, height: 166, color: "#c7c3b8", icon: "▥" },
  { name: "Desk", width: 110, height: 52, color: "#a9b5b6", icon: "▬" },
];

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 440;

function loadFurniture(): FurnitureItem[] {
  try {
    return JSON.parse(localStorage.getItem("domi-layout") || "[]") as FurnitureItem[];
  } catch {
    return [];
  }
}

export default function RoomBuilderPage() {
  const [roomWidth, setRoomWidth] = useState(DEFAULT_WIDTH);
  const [roomHeight, setRoomHeight] = useState(DEFAULT_HEIGHT);
  const [placedFurniture, setPlacedFurniture] = useState<FurnitureItem[]>(loadFurniture);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [productUrl, setProductUrl] = useState("");
  const [importedItems, setImportedItems] = useState<FurnitureTemplate[]>([]);
  const [importStatus, setImportStatus] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customWidth, setCustomWidth] = useState(36);
  const [customDepth, setCustomDepth] = useState(24);

  const allFurniture = useMemo(
    () => [...FURNITURE_PRESETS, ...importedItems],
    [importedItems],
  );

  useEffect(() => {
    localStorage.setItem("domi-layout", JSON.stringify(placedFurniture));
  }, [placedFurniture]);

  const clampPosition = (item: FurnitureTemplate, x: number, y: number) => ({
    x: Math.max(0, Math.min(x, roomWidth - item.width)),
    y: Math.max(0, Math.min(y, roomHeight - item.height)),
  });

  const handleDrop = (item: FurnitureTemplate, x: number, y: number) => {
    const position = clampPosition(item, x, y);
    const newItem: FurnitureItem = {
      ...item,
      ...position,
      id: crypto.randomUUID(),
      rotated: false,
    };
    setPlacedFurniture((current) => [...current, newItem]);
    setSelectedId(newItem.id);
  };

  const handleMove = (id: string, x: number, y: number) => {
    setPlacedFurniture((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const width = item.rotated ? item.height : item.width;
        const height = item.rotated ? item.width : item.height;
        return {
          ...item,
          x: Math.max(0, Math.min(x, roomWidth - width)),
          y: Math.max(0, Math.min(y, roomHeight - height)),
        };
      }),
    );
  };

  const rotateSelected = () => {
    setPlacedFurniture((current) =>
      current.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              rotated: !item.rotated,
              x: Math.min(item.x, roomWidth - (item.rotated ? item.width : item.height)),
              y: Math.min(item.y, roomHeight - (item.rotated ? item.height : item.width)),
            }
          : item,
      ),
    );
  };

  const deleteSelected = () => {
    setPlacedFurniture((current) => current.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  const handleImport = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productUrl.trim()) return;
    setIsImporting(true);
    setImportStatus("");
    try {
      const product = await importFurniture(productUrl.trim());
      const item: FurnitureTemplate = {
        name: product.name.slice(0, 28),
        width: 90,
        height: 55,
        color: "#c9bca9",
        icon: "◇",
      };
      setImportedItems((current) => [...current, item]);
      setProductUrl("");
      setImportStatus(`Added “${item.name}” to your furniture.`);
    } catch {
      setImportStatus("We couldn’t read that page. Check the link and try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleCustomFurniture = (event: React.FormEvent) => {
    event.preventDefault();
    const name = customName.trim();
    if (!name || customWidth < 1 || customDepth < 1) return;

    // The planner displays one inch as one pixel.
    setImportedItems((current) => [
      ...current,
      {
        name: name.slice(0, 28),
        width: customWidth,
        height: customDepth,
        color: "#b8c2b0",
        icon: "▧",
      },
    ]);
    setCustomName("");
    setCustomWidth(36);
    setCustomDepth(24);
  };

  return (
    <main className="page planner-page">
      <section className="page-intro planner-intro">
        <div>
          <p className="eyebrow">Step two</p>
          <h1>Make it fit.</h1>
          <p>Drag in the pieces you need, then move and rotate until the room feels right.</p>
        </div>
        <span className="step-count">02 / 02</span>
      </section>

      <section className="planner-toolbar" aria-label="Room controls">
        <div className="room-size-controls">
          <span>Room size</span>
          <label>
            <input
              max="800"
              min="400"
              onChange={(event) => setRoomWidth(Number(event.target.value))}
              step="40"
              type="number"
              value={roomWidth}
            />
            <small>width</small>
          </label>
          <span>×</span>
          <label>
            <input
              max="600"
              min="320"
              onChange={(event) => setRoomHeight(Number(event.target.value))}
              step="40"
              type="number"
              value={roomHeight}
            />
            <small>height</small>
          </label>
        </div>
        <div className="selection-actions">
          <button disabled={!selectedId} onClick={rotateSelected} type="button">↻ Rotate</button>
          <button disabled={!selectedId} onClick={deleteSelected} type="button">Delete</button>
          <button
            disabled={placedFurniture.length === 0}
            onClick={() => {
              setPlacedFurniture([]);
              setSelectedId(null);
            }}
            type="button"
          >
            Clear room
          </button>
        </div>
      </section>

      <section className="planner-workspace">
        <aside className="furniture-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Furniture</p>
              <h2>Add a piece</h2>
            </div>
            <span>{allFurniture.length}</span>
          </div>
          <div className="furniture-list">
            {allFurniture.map((item, index) => (
              <DragFurniture key={`${item.name}-${index}`} item={item} />
            ))}
          </div>

          <form className="custom-furniture-form" onSubmit={handleCustomFurniture}>
            <label htmlFor="custom-name">Add custom furniture</label>
            <input
              id="custom-name"
              onChange={(event) => setCustomName(event.target.value)}
              placeholder="Piece name"
              required
              value={customName}
            />
            <div className="custom-dimensions">
              <label>
                <span>Width</span>
                <input
                  min="1"
                  onChange={(event) => setCustomWidth(Number(event.target.value))}
                  required
                  type="number"
                  value={customWidth}
                />
                <small>in</small>
              </label>
              <span>×</span>
              <label>
                <span>Depth</span>
                <input
                  min="1"
                  onChange={(event) => setCustomDepth(Number(event.target.value))}
                  required
                  type="number"
                  value={customDepth}
                />
                <small>in</small>
              </label>
            </div>
            <button type="submit">Add to furniture</button>
          </form>

          <form className="import-form" onSubmit={handleImport}>
            <label htmlFor="product-url">Import from a product link</label>
            <div>
              <input
                id="product-url"
                onChange={(event) => setProductUrl(event.target.value)}
                placeholder="https://…"
                type="url"
                value={productUrl}
              />
              <button disabled={isImporting} type="submit">
                {isImporting ? "…" : "+"}
              </button>
            </div>
            {importStatus && <p>{importStatus}</p>}
          </form>
        </aside>

        <div className="canvas-area">
          <div className="canvas-heading">
            <p>Living room plan</p>
            <span>Saved automatically</span>
          </div>
          <RoomCanvas
            height={roomHeight}
            onDrop={handleDrop}
            onMove={handleMove}
            onSelect={setSelectedId}
            placedFurniture={placedFurniture}
            selectedId={selectedId}
            width={roomWidth}
          />
          <p className="canvas-tip">Tip: select a piece to rotate or delete it.</p>
        </div>
      </section>
    </main>
  );
}
