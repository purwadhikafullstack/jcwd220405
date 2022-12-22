import { Outlet } from "react-router-dom";
import { NavbarComp } from "./User/Navbar";
import { Footer } from "./User/Footer";
import { NavBottomMobile } from "./User/NavbarBottomMobile"

export const Layout = () => {
  return (
    <div>
      <NavbarComp />
      <Outlet />
      <Footer />
      <NavBottomMobile />
    </div>
  );
};
