// chakra
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Avatar,
  Center,
  Box,
  Stack,
} from "@chakra-ui/react";

//component
import { RegisterModal } from "./Authentications/RegisterModal";
import { LoginModal } from "./Authentications/LoginModal";

//redux
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { resetCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";

import { CgShoppingCart } from "react-icons/cg";

export const DrawerCompUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { name, picture } = useSelector((state) => state.userSlice.value);

  const onLogout = async () => {
    dispatch(logout());
    dispatch(resetCart());
    localStorage.removeItem("token");
  };

  return (
    <Box>
      <Button
        as={Avatar}
        size={"xl"}
        src={picture}
        bg="grey"
        onClick={onOpen}
        boxSize={{ base: 8, lg: 12 }}
        borderRadius={"50%"}
      />
      <Drawer onClose={onClose} isOpen={isOpen} size={"xs"}>
        <DrawerOverlay />
        <DrawerContent bg={"#D54B79"}>
          <DrawerCloseButton />
          <DrawerHeader borderBottom={"1px solid black"}>
            <Box>
              <Center>
                <Avatar
                  size={{ base: "xl", lg: "xl" }}
                  src={picture}
                  bg="grey"
                />
              </Center>
              <Box textAlign={"center"} hidden={name ? false : true}>
                Hi, {name}
              </Box>
            </Box>
          </DrawerHeader>
          <DrawerBody display={"flex"} flexDir={"column"}>
            {name ? (
              <Stack>
                <Button as={Link} to={"/profile/settings"}>
                  Profile
                </Button>
                <Button as={Link} to={"/order-list"}>
                  History
                </Button>
                <Button as={Link} to={"/cart"} leftIcon={<CgShoppingCart />}>
                  Cart
                </Button>
              </Stack>
            ) : (
              <Stack>
                <LoginModal />
                <RegisterModal />
              </Stack>
            )}
          </DrawerBody>
          {name ? (
            <DrawerFooter borderTop={"1px solid black"}>
              {/* <Center> */}
              <Button
                colorScheme={"teal"}
                onClick={() => {
                  onLogout();
                  onClose(onClose);
                }}
              >
                Sign Out
              </Button>
              {/* </Center> */}
            </DrawerFooter>
          ) : null}
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
