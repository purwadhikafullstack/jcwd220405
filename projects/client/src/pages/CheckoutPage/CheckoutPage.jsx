import { Container } from "@chakra-ui/react";
import React from "react";
import { CheckoutAddress } from "../../components/Checkout/CheckoutAddress";
import { CheckoutShipment } from "../../components/Checkout/CheckoutShipment";
import { NavbarComp } from "../../components/Navbar";

const baseServer = process.env.REACT_APP_SERVER;
const baseApi = process.env.REACT_APP_API_BASE_URL;

export const CheckoutPage = () => {
  return (
    <>
      <NavbarComp />
      <Container color={"white"} maxW="full" minH={"89.5vh"} pt={"10"}>
        <CheckoutAddress />
        <CheckoutShipment />
      </Container>
    </>
  );
};
