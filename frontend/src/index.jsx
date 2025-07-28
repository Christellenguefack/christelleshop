// main.jsx ou index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_live_51RH6pcCsSUs7pAQHlx1MrDqz06IvYMmaVyVrqLfKCc01T6rsvTmrIvFn7rTWK11FVqOO3X6Q6gZCvOgSIlWiQ2uJ00tF0dO4zb"); // ta clé publique Stripe

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Elements>
  </React.StrictMode>
);
