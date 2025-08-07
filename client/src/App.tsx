import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Home from "./pages/Home";
import { Moodboard } from "./pages/Moodboard";
import RoomBuilderPage from "./pages/RoomBuilder";

function App() {
  const [count, setCount] = useState(0);

  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route element={<Home />} path={"/"} />
          <Route element={<Moodboard />} path={"/moodboard"} />
          <Route element={<RoomBuilderPage />} path={"/roombuilder"} />
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;
