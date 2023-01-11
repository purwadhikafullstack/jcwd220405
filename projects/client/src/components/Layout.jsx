import { Outlet } from "react-router-dom";
import { NavbarComp } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div>
      <NavbarComp />
      <Outlet />
      <Footer />
    </div>
  );
};
