import React from 'react';
import { createRoot } from 'react-dom/client';

export function mountReactComponent(containerId, Component) {
  const container = document.getElementById(containerId);
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <Component />
      </React.StrictMode>
    );
  } else {
    console.error(`Container #${containerId} not found`);
  }
}