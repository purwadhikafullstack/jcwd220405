// import logo from "./logo.svg";
import "./App.css";

// react
import Axios from "axios";
import { useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";

// components
import { Layout } from "./components/Layout";
import { NavbarTest } from "./components/test";
import { ProtectingRoute } from "./components/ProtectingRoute";

// pages
import { HomePage } from "./pages/HomePage";
import { AdminPage } from "./pages/AdminPage";
import { ProductPage } from "./pages/ProductPage/ProductPage";
import { DetailProductPage } from "./pages/ProductPage/DetailProductPage";
import { CartPage } from "./pages/CartPage/CartPage";
import { NotFoundPage } from "./pages/NotFound/NotFound";
import { VerificationPage } from "./pages/VerificationPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { ProfileAddressPage } from "./pages/ProfilePage/ProfileAddressPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { OrderListPage } from "./pages/OrderListPage";
import { CheckoutPage } from "./pages/CheckoutPage/CheckoutPage";

//redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/userSlice";
import { cartUser } from "./redux/cartSlice";

const url = process.env.REACT_APP_API_BASE_URL;

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { id } = useSelector((state) => state.userSlice.value);

  const keepLogin = useCallback(async () => {
    try {
      const result = await Axios.get(`${url}/user/keeplogin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        login({
          id: result.data.id,
          email: result.data.email,
          name: result.data.name,
          is_verified: result.data.is_verified,
          role: result.data.role,
        })
      );

      const cart = await (await Axios.get(`${url}/cart/${id}`)).data;
      dispatch(cartUser(cart.result));
    } catch (err) {
      console.log(err);
      console.log(err.response.data);
    }
  }, [dispatch, id, token]);

  const testApi = async () => {
    try {
      const response = await (await Axios.get(url)).data;
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    testApi();
    keepLogin();
    console.log("MOKOMDO HERE");
  }, [keepLogin]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/order-list" element={<OrderListPage />} />
        </Route>
        <Route
          path="/profile/settings"
          element={
            <ProtectingRoute>
              <ProfilePage />
            </ProtectingRoute>
          }
        />
        <Route
          path="/profile/settings/address"
          element={
            <ProtectingRoute>
              <ProfileAddressPage />
            </ProtectingRoute>
          }
        />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:name" element={<DetailProductPage />} />
        <Route
          path="/cart"
          element={
            <ProtectingRoute>
              <CartPage />
            </ProtectingRoute>
          }
        />
        <Route
          path="/cart/checkout"
          element={
            <ProtectingRoute>
              <CheckoutPage />
            </ProtectingRoute>
          }
        />

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
