import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GoogleMapsProvider from "./components/user/placeOrder/GoogleMapsProvider";

import "leaflet/dist/leaflet.css";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60 * 1000 },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleMapsProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
              <App />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleMapsProvider>
  </React.StrictMode>,
);
