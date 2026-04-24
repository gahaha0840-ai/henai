import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ItemsProvider } from "./context/ItemsContext";
import Home from "./pages/Home";
import Photos from "./pages/Photos";
import Zukan from "./pages/Zukan";
import Observation from "./pages/Observation";

export default function App() {
  return (
    <ItemsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/zukan" element={<Zukan />} />
          <Route path="/obs" element={<Observation />} />
        </Routes>
      </BrowserRouter>
    </ItemsProvider>
  );
}
