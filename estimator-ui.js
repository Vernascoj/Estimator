import { createRoot } from "react-dom/client";
import EstimatorApp from "./EstimatorApp.js";
import React from "react";

export function renderUI(container) {
  const root = createRoot(container);
  root.render(<EstimatorApp />);
}