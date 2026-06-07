import { useState } from "react";
import { Link } from "react-router-dom";
import { generateMoodboard } from "../endpoints/moodboard";

const VIBE_OPTIONS = ["minimal", "cozy", "earthy", "modern", "eclectic"];
const ROOM_OPTIONS = ["bedroom", "living room", "kitchen", "office", "dining room"];

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=85",
];

export function Moodboard() {
  const [images, setImages] = useState<string[]>(DEMO_IMAGES);
  const [vibe, setVibe] = useState("cozy");
  const [roomType, setRoomType] = useState("living room");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const handleGeneration = async () => {
    setLoading(true);
    setNotice("");
    try {
      const moodboard = await generateMoodboard(vibe, roomType);
      if (moodboard.length === 0) throw new Error("No images returned");
      setImages(moodboard);
    } catch {
      setImages(DEMO_IMAGES);
      setNotice("Showing a curated board while the image service is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="page-intro moodboard-intro">
        <div>
          <p className="eyebrow">Step one</p>
          <h1>Set the mood.</h1>
          <p>Pick two ingredients and we’ll build a visual direction for your space.</p>
        </div>
        <span className="step-count">01 / 02</span>
      </section>

      <section className="moodboard-workspace">
        <aside className="control-panel">
          <div className="field-group">
            <label htmlFor="vibe">How should it feel?</label>
            <div className="choice-grid">
              {VIBE_OPTIONS.map((option) => (
                <button
                  className={vibe === option ? "choice active" : "choice"}
                  key={option}
                  onClick={() => setVibe(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="room-type">Which room?</label>
            <select
              id="room-type"
              value={roomType}
              onChange={(event) => setRoomType(event.target.value)}
            >
              {ROOM_OPTIONS.map((room) => (
                <option key={room} value={room}>
                  {room.charAt(0).toUpperCase() + room.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            className="button button-primary generate-button"
            disabled={loading}
            onClick={handleGeneration}
            type="button"
          >
            {loading ? "Gathering ideas…" : "Generate new board"}
          </button>
          {notice && <p className="form-notice">{notice}</p>}
        </aside>

        <div>
          <div className="board-meta">
            <div>
              <p className="eyebrow">Your direction</p>
              <h2>{vibe} {roomType}</h2>
            </div>
            <Link className="text-link" to="/roombuilder">
              Plan this room →
            </Link>
          </div>
          <div className="mood-grid" aria-live="polite">
            {images.map((url, index) => (
              <figure key={`${url}-${index}`} className={`mood-tile tile-${index + 1}`}>
                <img src={url} alt={`${vibe} ${roomType} inspiration ${index + 1}`} />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
