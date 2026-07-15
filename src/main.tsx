import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { primeVoices } from "@/lib/tts";

// Cihazın sesli okuma seslerini önceden yükle (dualar için)
primeVoices();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
