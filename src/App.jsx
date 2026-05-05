import { Routes, Route } from "react-router-dom";
import Login from "./views/login";
import Chat from "./views/chat";
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}