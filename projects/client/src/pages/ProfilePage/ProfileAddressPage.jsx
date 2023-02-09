import { Container } from "@chakra-ui/react";
import { Address } from "../../components/Address/Address";
import { NavProfile } from "../../components/Profile/NavProfile";
import { NavbarComp } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export const ProfileAddressPage = () => {
  return (
    <>
      <NavbarComp />
      <Container minH={"89.5vh"} maxW={"100%"} p={5} color={"white"}>
        <Container maxW="container.lg">
          <Container
            maxW={"100%"}
            h={"12"}
            border={"2px"}
            borderColor="gray.200"
            borderRadius="lg"
            borderBottomRadius={"none"}
            pt={"2.5"}
          >
            <NavProfile />
          </Container>
          <Container
            maxW="container.lg"
            border="2px"
            borderColor="gray.200"
            borderRadius="lg"
            borderTop={"none"}
            borderTopRadius={"none"}
            p={5}
          >
            <Address />
          </Container>
        </Container>
      </Container>
      <Footer />
    </>
  );
};
