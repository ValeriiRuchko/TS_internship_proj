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
import { CreateAndUpdateMed } from "./pages/CreateAndUpdateMed.tsx";
import { StatisticsPage } from "./pages/StatisticsPage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
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
        children: [
          {
            path: "create-and-change-med",
            element: <CreateAndUpdateMed />,
          },
          {
            path: "statistics",
            element: <StatisticsPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
