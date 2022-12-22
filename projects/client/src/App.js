// import logo from "./logo.svg";
import "./App.css";

// chakra
import { Box } from "@chakra-ui/react";

// route
import { Routes, Route } from "react-router-dom";

// components
import { Layout } from "./components/Layout";
// import { NavbarTest } from "./components/test";
// import { DrawerCompUser } from "./components/DrawerUser";
// import { Footer } from "./components/Footer"
// import { CarouselBanner } from "./components/CarouselBanner"
// import { FeaturedCategories } from "./components/FeatCategories"
// import { BreadCrumbsComp } from "./components/BreadCrumbs"

// pages
import { VerificationPage } from "./pages/VerificationPage";
import { HomePage } from "./pages/HomePage";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFound/NotFound";

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
    <Box>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/verification/:token" element={<VerificationPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Test Components */}
        {/* <Route path="/test" element={<NavbarTest />} /> */}

        {/* not found  */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* <Footer /> */}
    </Box>
  );
}

export default App;
