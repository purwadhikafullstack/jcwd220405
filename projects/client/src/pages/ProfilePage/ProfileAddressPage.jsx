import React from "react";
import { Container } from "@chakra-ui/react";
import { Address } from "../../components/Address/Address";
import { NavProfile } from "../../components/Profile/NavProfile";

export const ProfileAddressPage = () => {
  return (
    <Container
      maxW={"100%"}
      h={"100vh"}
      p={5}
      bgGradient="linear(150.64deg, #3B0D2C 0%, rgba(74, 10, 71, 1) 16.61%, #2F0C39 61.16%, rgba(38, 8, 67, 1)  92.29%)"
      color={"white"}
    >
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
  );
};
