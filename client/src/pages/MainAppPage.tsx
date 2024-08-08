import { observer } from "mobx-react-lite";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MainPage } from "./MainPage";
import { Header } from "../components/Header";
import { useEffect } from "react";
import { useStore } from "../models/RootStore";

export const MainAppPage = observer(() => {
  const rootStore = useStore();
  const currLocation = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem("token") === null ||
      rootStore.user === undefined
    ) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate, rootStore.user]);

  return (
    <>
      <Header />
      {currLocation.pathname === "/app" ? <MainPage /> : <Outlet />}
    </>
  );
});
