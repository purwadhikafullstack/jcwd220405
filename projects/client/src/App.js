// import logo from "./logo.svg";
import "./App.css";

// chakra
import { Box } from "@chakra-ui/react";

// route
import { Routes, Route } from "react-router-dom";

// components
import { Layout } from "./components/Layout";
import { NavbarTest } from "./components/test";
import { DrawerCompUser } from "./components/DrawerUser";
import { VerificationPage } from "./pages/VerificationPage";
// import { Footer } from "./components/Footer"
// import { CarouselBanner } from "./components/CarouselBanner"
// import { FeaturedCategories } from "./components/FeatCategories"
// import { BreadCrumbsComp } from "./components/BreadCrumbs"

// pages
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFound/NotFound";

import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const testApi = async () => {
    try {
      const response = await (
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}`)
      ).data;
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

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

        {/* Test Components */}
        {/* <Route path="/carousel" element={<CarouselBanner />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/featured" element={<FeaturedCategories />} />
        <Route path="/breadcrumbs/featured/test2" element={<BreadCrumbsComp />} /> */}
        <Route path="/drawer" element={<DrawerCompUser />} />
        <Route path="/test" element={<NavbarTest />} />

        {/* not found  */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/verification/:token" element={<VerificationPage />} />
      </Routes>
      {/* <Footer /> */}
    </Box>
  );
}

export default App;
