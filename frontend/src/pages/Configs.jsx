import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ConfigTable from "../components/ConfigTable";
import api from "../services/api";
import "../styles/Configs.css";

export default function Configs() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConfigs = async () => {
    try {
      const res = await api.get("/configs");
      setConfigs(res.data);
    } catch (err) {
      console.error("Error fetching configs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleUpdate = async (id, payload) => {
    try {
      await api.put(`/configs/${id}`, payload);
      fetchConfigs(); // refresh after update
    } catch (err) {
      console.error("Error updating config", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="configs-container">
      <Sidebar />
      <main className="configs-main">
        <h1>API List</h1>
        <ConfigTable configs={configs} onUpdate={handleUpdate} />
      </main>
    </div>
  );
}
