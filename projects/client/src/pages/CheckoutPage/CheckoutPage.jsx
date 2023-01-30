import { Container, Box } from "@chakra-ui/react";
import React from "react";
import { CheckoutAddress } from "../../components/Checkout/CheckoutAddress";
import { CheckoutShipment } from "../../components/Checkout/CheckoutShipment";
import { NavbarComp } from "../../components/Navbar";

// const baseServer = process.env.REACT_APP_SERVER;
// const baseApi = process.env.REACT_APP_API_BASE_URL;

export const CheckoutPage = () => {
  return (
    <>
      <NavbarComp />
      <Container
        color={"white"}
        maxW="full"
        minH={"89.5vh"}
        pt={20}
        bgGradient="linear(150.64deg, #3B0D2C 0%, rgba(74, 10, 71, 1) 16.61%, #2F0C39 61.16%, rgba(38, 8, 67, 1)  92.29%)"
        // bg="gray"
      >
        <Container
          bgGradient="linear(150.64deg, #3B0D2C 0%, rgba(74, 10, 71, 1) 16.61%, #2F0C39 61.16%, rgba(38, 8, 67, 1)  92.29%)"
          // bg={"gray"}
          maxW="inherit"
          minH={"inherit"}
        >
          <CheckoutAddress />
          <CheckoutShipment />
        </Container>
      </Container>
    </>
  );
};
