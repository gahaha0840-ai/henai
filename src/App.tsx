//import Home from "./pages/Home";

//function App() {
//  return <Home />;
//}

//export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import Photos from "./pages/Photos.tsx";
import Observation from "./pages/Observation.tsx";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/observation" element={<Observation />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
