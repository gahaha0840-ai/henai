//import Home from "./pages/Home";

//function App() {
//  return <Home />;
//}

//export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Photos from "./pages/Photos";
import Observation from "./pages/Observation";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/obs" element={<Observation />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
