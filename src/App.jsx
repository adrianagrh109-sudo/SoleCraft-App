// src/App.jsx
import './App.css';
import Scene from "./components/scene/Scene.jsx";
import CustomizationContextProvider from "./context/CustomizationContex.jsx";
import CustomizationInterface from "./components/CustomizationInterface.jsx";
import MobileCustomizationInterface from "./components/MobileCustomizationInterface.jsx";
import Media from "react-media";

// 1. Import library routing yang udah lu install tadi
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../src/admin/Dashboard.jsx'; // Pastikan path-nya benar sesuai tempat lu bikin filenya

// 2. Kita bungkus halaman utama sepatu lu ke dalam sebuah komponen terpisah biar rapi
function ShoeCustomizer() {
  return (
    <CustomizationContextProvider>
      <div className="App">
        <Scene />
        <Media queries={{ small: "(max-width: 599px)" }}>
          {(matches) => (matches.small ? <MobileCustomizationInterface /> : <CustomizationInterface />)}
        </Media>
      </div>
    </CustomizationContextProvider>
  );
}

// 3. Di komponen utama App, baru kita atur jalurnya (Routing)
function App() {
  return (
    <Router>
      <Routes>
        {/* Jalur Utama: Kalau akses biasa (http://localhost:5173/) tampilkan alat kustomisasi sepatu */}
        <Route path="/" element={<ShoeCustomizer />} />

        {/* Jalur Admin: Kalau akses (http://localhost:5173/admin) tampilkan dashboard admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;