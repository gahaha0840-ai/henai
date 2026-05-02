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
import Zukan from "./pages/Zukan.tsx";
import Record from "./pages/Record.tsx";
import Account from "./pages/Account.tsx";
import UserProfile from "./pages/UserProfile.tsx";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/observation" element={<Observation />} />
          <Route path="/zukan" element={<Zukan />} />
          <Route path="/record" element={<Record />} />
          <Route path="/account" element={<Account />} />
          <Route path="/user/:userId" element={<UserProfile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
