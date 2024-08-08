import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignUpPage } from "./pages/SignUpPage.tsx";
import { MainAppPage } from "./pages/MainAppPage.tsx";
// import { SignInPage } from "./pages/SignInPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "app",
        element: <MainAppPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
