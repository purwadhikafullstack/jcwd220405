import { Container } from "@chakra-ui/react";
import React from "react";
import { NavbarComp } from "../../components/Navbar";
import { ProductDetail } from "../../components/Product/ProductDetail";

export const DetailProductPage = () => {
  return (
    <>
      <NavbarComp />
      <Container maxW={"full"} pt={"8"}>
        <ProductDetail />
      </Container>
    </>
  );
};
