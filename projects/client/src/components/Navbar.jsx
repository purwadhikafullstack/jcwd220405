// main
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  useToast,
  Tooltip,
} from "@chakra-ui/react";

// icons
import { BiSearchAlt } from "react-icons/bi";
import { CgShoppingCart, CgHeart } from "react-icons/cg";

// comp
import { DrawerCompUser } from "./DrawerUser";
import { RegisterModal } from "../components/Authentications/RegisterModal";
import { LoginModal } from "../components/Authentications/LoginModal";
import { CartButton } from "./Button/CartButton";
import { useEffect } from "react";

//redux
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

export const NavbarComp = ({
  setPage,
  searchquery,
  setSearchParams,
  setPmax,
  setPmin,
}) => {
  const { name } = useSelector((state) => state.userSlice.value);

  const [isMobile] = useMediaQuery("(max-width: 1007px)");
  const navigate = useNavigate();
  const toast = useToast();
  const [valuesearch, setValueSearch] = useState("");
  const [enter, setEnter] = useState(0);
  const location = useLocation();

  function handleSearch() {
    if (location.pathname === "/product") {
      setPage(1);
      setPmax(null);
      setPmin(null);
      setSearchParams(`search_query=${valuesearch}`);
    }
  }

  // useEffect(() => {}, [user]);

  return (
    <Box px={{ base: 4, md: "28" }} py={{ base: 1, md: 4 }}>
      <Container>
        <Center>
          <Grid
            h={{ base: "45px" }}
            alignItems={"center"}
            templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }}
            gap={{ base: 3, md: 3, lg: 5 }}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (!valuesearch) {
                          if (enter === 2) {
                            return setTimeout(
                              () => window.location.reload(),
                              500
                            );
                          }
                          toast({
                            position: "top",
                            title: `Find Something?`,
                            variant: "subtle",
                            duration: 1500,
                            isClosable: true,
                          });
                          return setEnter(enter + 1);
                        }
                        navigate(`/product?search_query=${e.target.value}`);
                        if (location.pathname === "/product") {
                          setPage(1);
                          setPmax(null);
                          setPmin(null);
                          setSearchParams(`search_query=${e.target.value}`);
                        }
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      setValueSearch(e.target.value);
                    }}
                    defaultValue={searchquery}
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
                  <Tooltip label="Search" hasArrow>
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
                      onClick={() => {
                        navigate(`/product?search_query=${valuesearch}`);
                        handleSearch();
                      }}
                      disabled={valuesearch ? false : true}
                    />
                  </Tooltip>
                </Box>
              </Flex>
            </GridItem>
            <GridItem
              display={{ base: "none", md: "block" }}
              w={{ base: "50px", md: "150px" }}
              // borderRight={"1px solid white"}
            >
              <Flex>
                {/* <IconButton
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
                /> */}
                <CartButton />
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
                {name || isMobile ? (
                  <DrawerCompUser />
                ) : (
                  <Flex gap={4} display={{ base: "none", lg: "inline-flex" }}>
                    <LoginModal />
                    <RegisterModal />
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
