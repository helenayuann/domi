import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Home from "./pages/Home";
import { Moodboard } from "./pages/Moodboard";
import RoomBuilderPage from "./pages/RoomBuilder";

function Brand() {
  return (
    <NavLink className="brand" to="/" aria-label="Domi home">
      <span className="brand-mark">d</span>
      <span>domi</span>
    </NavLink>
  );
}

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <div className="app-shell">
          <header className="site-header">
            <Brand />
            <nav className="site-nav" aria-label="Main navigation">
              <NavLink to="/moodboard">Moodboard</NavLink>
              <NavLink to="/roombuilder">Room planner</NavLink>
            </nav>
          </header>

          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Moodboard />} path="/moodboard" />
            <Route element={<RoomBuilderPage />} path="/roombuilder" />
          </Routes>
        </div>
      </BrowserRouter>
    </DndProvider>
  );
}

export default App;
