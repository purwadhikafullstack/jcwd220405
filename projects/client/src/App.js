// import logo from "./logo.svg";
import "./App.css";

// route
import { Routes, Route, Navigate } from "react-router-dom";

// components
import { Layout } from "./components/Layout";
import { NavbarTest } from "./components/test";
import { DrawerCompUser } from "./components/DrawerUser";
// import { Footer } from "./components/Footer"
// import { CarouselBanner } from "./components/CarouselBanner"
// import { FeaturedCategories } from "./components/FeatCategories"
// import { BreadCrumbsComp } from "./components/BreadCrumbs"

// pages
import { HomePage } from "./pages/HomePage";
import { AdminPage } from "./pages/AdminPage";
import { ProductPage } from "./pages/ProductPage/ProductPage";
import { DetailProductPage } from "./pages/ProductPage/DetailProductPage";
import { NotFoundPage } from "./pages/NotFound/NotFound";
import { VerificationPage } from "./pages/VerificationPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { ProfileAddressPage } from "./pages/ProfilePage/ProfileAddressPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

import Axios from "axios";
import { useEffect } from "react";

//redux
import { useDispatch } from "react-redux";
import { login } from "./redux/userSlice";

const url = process.env.REACT_APP_API_BASE_URL;

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const keepLogin = async () => {
    try {
      const result = await Axios.get(`${url}/user/keeplogin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(result.data);
      // setRole(result.data.role);
      console.log(result.data.role);

      dispatch(
        login({
          id: result.data.id,
          email: result.data.email,
          name: result.data.name,
        })
      );
    } catch (err) {
      console.log(err);
      console.log(err.response.data);
    }
  };

  const testApi = async () => {
    try {
      const response = await (await Axios.get(url)).data;
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    keepLogin();
  }, []);

  useEffect(() => {
    testApi();
    // keepLogin();
    console.log("MOKOMDO HERE");
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/profile/settings" element={<ProfilePage />} />
          <Route
            path="/profile/settings/address"
            element={<ProfileAddressPage />}
          />
        </Route>
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:name" element={<DetailProductPage />} />

        <Route path="/admin" element={<AdminPage />} />
        <Route path="/verification/:token" element={<VerificationPage />} />
        <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />

        {/* Test Components */}
        <Route path="/test" element={<NavbarTest />} />

        {/* not found  */}
        <Route path="*" element={<NotFoundPage />} />
        {/* <Footer /> */}
      </Routes>
    </>
  );
}

export default App;
