import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerServiceWorker } from "./pwa/register-sw";

// Register the service worker for PWA functionality
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
