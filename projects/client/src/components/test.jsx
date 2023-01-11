// main
import { useState } from "react";

// logo
import icon from "../assets/mokomdo-icon2.png";
import mokomdo from "../assets/mokomdo2.png";
import mokomdo2 from "../assets/mokomdo-simplified2.png";

// chakra
import {
  Box,
  Flex,
  Link,
  IconButton,
  Button,
  Image,
  Input,
  Grid,
  GridItem,
  Center,
  Container,
  useMediaQuery,
} from "@chakra-ui/react";

// icons
import { BiSearchAlt } from "react-icons/bi";
import { CgShoppingCart, CgHeart } from "react-icons/cg";

// comp
import { DrawerCompUser } from "./DrawerUser";
import { useEffect } from "react";

export const NavbarTest = () => {
  const [user, setUser] = useState();
  const [isMobile] = useMediaQuery("(max-width: 1007px)");

  useEffect(() => {}, [user]);

  return (
    <Box bg={"#351734"} px={{ base: 4, md: "28" }} py={{ base: 1, md: 4 }}>
      <Container>
        <Center>
          <Grid
            h={{ base: "45px" }}
            alignItems={"center"}
            templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }}
            gap={{ base: 3,md: 3, lg: 5 }}
          >
            <GridItem colSpan={{ base: 1 }} w={{ base: "50px", md: "200px" }}>
              <Center>
                <Link
                  as={Image}
                  href={"/"}
                  src={icon}
                  w={"auto"}
                  h={8}
                  display={{ md: "none" }}
                />
                <Link
                  as={Image}
                  href={"/"}
                  src={mokomdo2}
                  w={"auto"}
                  h={9}
                  display={{ base: "none", md: "block", lg: "none" }}
                />
                <Link
                  as={Image}
                  href={"/"}
                  src={mokomdo}
                  w={"auto"}
                  h={10}
                  display={{ base: "none", md: "none", lg: "block" }}
                />
              </Center>
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <Flex>
                <Box
                  border={"1px solid white"}
                  transform={"skew(-20deg)"}
                  p={{ base: "3px" }}
                  // paddingBottom={{ base: "5px" }}
                  // h={{ base: "10px", md: "30px" }}
                >
                  <Input
                    h={{ md: "30px" }}
                    w={{ base: "200px", md: "300px", lg: "80vh" }}
                    borderRadius={0}
                    style={{ border: "none", outline: "none" }}
                    transform={"skew(20deg)"}
                    color={"white"}
                    placeholder="Search"
                    _placeholder={{
                      color: "grey",
                      fontSize: { base: "14px", md: "20px" },
                    }}
                    _focusVisible={{
                      outline: "none",
                    }}
                  />
                </Box>
                <Box
                  border={"1px solid white"}
                  paddingTop={{ base: "1px" }}
                  transform={"skew(-20deg)"}
                  bg={"#D54B79"}
                  transition={"0.5s"}
                  _hover={{ bg: "#C146ED" }}
                >
                  <IconButton
                    icon={<BiSearchAlt />}
                    h={{ base: "10px", md: "40x" }}
                    minW={{ base: "30px", md: "40px" }}
                    fontSize={{ md: "2xl" }}
                    borderRadius={0}
                    transform={"skew(20deg)"}
                    bg="none"
                    color={"black"}
                    _hover={{
                      bg: "none",
                    }}
                    _active={{
                      bg: "none",
                      color: "white",
                    }}
                  />
                </Box>
              </Flex>
            </GridItem>
            <GridItem
              display={{ base: "none", md: "block" }}
              w={{ base: "50px", md: "150px" }}
              // borderRight={"1px solid white"}
            >
              <Flex>
                <IconButton
                  icon={<CgShoppingCart />}
                  fontSize={"35px"}
                  href={"#"}
                  bg={"none"}
                  borderRadius={0}
                  borderRight={"1px solid white"}
                  color={"#D54B79"}
                  width={70}
                  height={30}
                  _hover={{
                    bg: "none",
                    color: "#C146ED",
                  }}
                  _active={{ color: "white" }}
                />
                <IconButton
                  icon={<CgHeart />}
                  fontSize={"35px"}
                  href={"#"}
                  bg={"none"}
                  borderRadius={0}
                  borderRight={"1px solid white"}
                  color={"#D54B79"}
                  width={70}
                  height={30}
                  _hover={{
                    bg: "none",
                    color: "#C146ED",
                  }}
                  _active={{ color: "white" }}
                />
              </Flex>
            </GridItem>
            <GridItem colSpan={{ base: 1 }} w={{ base: "50px", lg: "200px" }}>
              <Center>
                {user || isMobile ? (
                  <DrawerCompUser />
                ) : (
                  <Flex gap={4} display={{ base: "none", lg: "inline-flex" }}>
                    <Button
                      fontSize={"sm"}
                      fontWeight={600}
                      bg={"none"}
                      border={"1px solid"}
                      borderColor={"#D54B79"}
                      color={"#D54B79"}
                      href={"#"}
                      _hover={{
                        borderColor: "#C146ED",
                        color: "#C146ED",
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      fontSize={"sm"}
                      fontWeight={600}
                      color={"white"}
                      bg={"#D54B79"}
                      href={"#"}
                      _hover={{
                        bg: "#C146ED",
                      }}
                    >
                      Sign Up
                    </Button>
                  </Flex>
                )}
              </Center>
            </GridItem>
          </Grid>
        </Center>
      </Container>
    </Box>
  );
};
