import { Container } from "@chakra-ui/react";
import { Cart } from "../../components/Cart/Cart";
import { NavbarComp } from "../../components/Navbar";

const baseServer = process.env.REACT_APP_SERVER;
const baseApi = process.env.REACT_APP_API_BASE_URL;

export const CartPage = () => {
  return (
    <>
      <NavbarComp />
      <Container color={"white"} maxW="full" minH={"89.5vh"} pt={"10"}>
        <Cart baseServer={baseServer} baseApi={baseApi} />
      </Container>
    </>
  );
};
