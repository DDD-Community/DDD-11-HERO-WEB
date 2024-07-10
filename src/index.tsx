import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// page component
import App from "@src/App";
import "@src/style/tailwind.css";

const container = document.getElementById("root");

if (container instanceof HTMLElement) {
  const root = createRoot(container);

  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}
