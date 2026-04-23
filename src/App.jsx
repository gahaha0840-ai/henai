import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Zukan from "./pages/Zukan";
import Observation from "./pages/Observation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/zukan" element={<Zukan />} />
        <Route path="/obs" element={<Observation />} />
      </Routes>
    </BrowserRouter>
  );
}
