import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Logs from "./pages/Logs";  
import Analysis from "./pages/Analysis"; 
import Configs from "./pages/Configs"; 


// Stub pages until you design them
// function Logs() {
//   return <div className="page-container"><h1>Logs Page</h1></div>;
// }
// function Configs() {
//   return <div className="page-container"><h1>Configs Page</h1></div>;
// }
function Keys() {
  return <div className="page-container"><h1>Keys Page</h1></div>;
}
// function Analysis() {
//   return <div className="page-container"><h1>Analysis Page</h1></div>;
// }

export default function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/configs" element={<Configs />} />
          <Route path="/keys" element={<Keys />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </div>
    </div>
  );
}
