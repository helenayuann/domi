import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Find your direction",
    copy: "Choose a room and a feeling. Domi gathers a visual starting point in seconds.",
  },
  {
    number: "02",
    title: "Plan the pieces",
    copy: "Arrange furniture on a simple floor plan and see what fits before you buy.",
  },
  {
    number: "03",
    title: "Keep it together",
    copy: "Import a product from a link and keep your ideas in one focused workspace.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Room design, made approachable</p>
          <h1>A room that feels like you.</h1>
          <p className="hero-description">
            Turn a loose idea into a moodboard and a workable layout, without
            needing to be an interior designer.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/moodboard">
              Start with a moodboard
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" to="/roombuilder">
              Open room planner
            </Link>
          </div>
        </div>

        <div className="hero-art" aria-label="Abstract interior design collage">
          <div className="hero-swatch hero-swatch-1" />
          <div className="hero-swatch hero-swatch-2" />
          <div className="hero-room">
            <div className="hero-window" />
            <div className="hero-table" />
            <div className="hero-chair" />
            <div className="hero-plant">
              <i />
              <i />
              <i />
            </div>
          </div>
          <p>soft light · warm wood · lived in</p>
        </div>
      </section>

      <section className="home-features">
        <div className="section-heading">
          <p className="eyebrow">A simple process</p>
          <h2>From inspiration to a plan.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span>{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
