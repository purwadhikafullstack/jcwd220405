// components
import { BreadCrumbsComp } from "./BreadCrumbs";

// chakra
import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Center,
} from "@chakra-ui/react";

const ListHeader = ({ children }) => {
  return (
    <Text
      fontWeight={"500"}
      fontSize={{ base: "xl", lg: "2xl" }}
      mb={2}
      align={"flex-start"}
      textDecor={"underline"}
    >
      {children}
    </Text>
  );
};

export const Footer = () => {
  return (
    // bg={"#2B0A3E"}
    <Box>
      <Container maxW={"7xl"} py={3} borderTop={"1px solid white"}>
        <BreadCrumbsComp />
      </Container>
      <Container as={Stack} maxW={"7xl"} py={8} borderY={"1px solid white"}>
        <Center>
          <SimpleGrid
            templateColumns={{ sm: "1fr 1fr", md: "3fr 1fr 1fr 1fr" }}
            spacing={8}
            color={"white"}
            maxW={"6xl"}
          >
            <Stack marginRight={8}>
              <ListHeader>About Us</ListHeader>
              <Text textAlign={"justify"} fontSize={{ base: "2xs", lg: "xs" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </Stack>
            <Stack>
              <ListHeader>Product</ListHeader>
              <Link href={"/"}>All Product</Link>
              <Link href={"#"}>All Category</Link>
              <Link href={"#"}>Search</Link>
            </Stack>
            <Stack>
              <ListHeader>Help</ListHeader>
              <Link href={"#"}>Shopping Help</Link>
              <Link href={"#"}>Terms and Conditions</Link>
              <Link href={"#"}>Privacy Policy</Link>
            </Stack>
            <Stack>
              <ListHeader>Follow Us</ListHeader>
              <Link href={"#"}>Facebook</Link>
              <Link href={"#"}>Twitter</Link>
              <Link href={"#"}>Instagram</Link>
              <Link href={"#"}>LinkedIn</Link>
            </Stack>
          </SimpleGrid>
        </Center>
      </Container>
      <Center>
        <Text my={"30px"} color={"white"} textAlign="center">
          Copyright ©️ 2022 All Rights Reversed by MOKOMDO
        </Text>
      </Center>
    </Box>
  );
};
