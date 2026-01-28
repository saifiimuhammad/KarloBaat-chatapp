import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Failed to find root element");

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <div
            onContextMenu={(e) => e.preventDefault()}
            className="font-sans text-text min-h-screen"
          >
            <App />
          </div>
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
