import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// iOS 26 safe area fix: Apply position fixed on body for iOS to prevent viewport displacement
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
if (isIOS) {
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  document.body.style.overflow = 'hidden';

  // Make the root element scrollable instead
  const root = document.getElementById("root");
  if (root) {
    root.style.height = '100%';
    root.style.overflow = 'auto';
    root.style.webkitOverflowScrolling = 'touch';
  }
}

createRoot(document.getElementById("root")!).render(<App />);
