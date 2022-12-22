// import logo from "./logo.svg";
import "./App.css";

// route
import { Routes, Route } from "react-router-dom";

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
import { NotFoundPage } from "./pages/NotFound/NotFound";
import { VerificationPage } from "./pages/VerificationPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { ProfileAddressPage } from "./pages/ProfilePage/ProfileAddressPage";

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
  });

  useEffect(() => {
    testApi();
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

        {/* Test Components */}
        {/* <Route path="/carousel" element={<CarouselBanner />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/featured" element={<FeaturedCategories />} />
        <Route path="/breadcrumbs/featured/test2" element={<BreadCrumbsComp />} /> */}
        <Route path="/drawer" element={<DrawerCompUser />} />
        <Route path="/test" element={<NavbarTest />} />
        <Route path="/verification/:token" element={<VerificationPage />} />

        {/* not found  */}
        <Route path="*" element={<NotFoundPage />} />
        {/* <Footer /> */}
      </Routes>
    </>
  );
}

export default App;
