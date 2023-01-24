// react
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

// chakra
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  Button,
  useDisclosure,
  Box,
  Flex,
  Image,
  IconButton,
  Container,
  Avatar,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

// logo
import mokomdo2 from "../assets/mokomdo-simplified2.png";

// icon
import { FiMenu } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

// component
import { AdminBody } from "../components/Admin/AdminBody";

export const AdminPage = () => {
  const [context, setContext] = useState(0);

  const { name, role } = useSelector((state) => state.userSlice.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  const NavbarAdmin = () => {
    return (
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height={"20"}
        alignItems="center"
        bg={"#351734"}
        justifyContent={{ base: "space-between", md: "flex-end" }}
        borderLeft={"1px solid white"}
      >
        <DrawerAdmin />

        <Image
          src={mokomdo2}
          display={{ base: "block", md: "none" }}
          w={"auto"}
          h={10}
        />

        <HStack spacing={{ base: "0", md: "6" }}>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              >
                <HStack>
                  <Avatar
                    size={"sm"}
                    src={"https://bit.ly/broken-link"}
                    border={"1px solid white"}
                  />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm" color="white">
                      {name}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown color={"white"} />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue("white", "gray.900")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
              >
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={() => {
                    onLogout();
                    navigate("/");
                  }}
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
    );
  };

  const DrawerAdmin = () => {
    return (
      <Box>
        <Container>
          <DrawerAdminMobile />
          <Box
            transition="3s ease"
            bg={"#351734"}
            w={{ base: 40, md: 60 }}
            pos={"fixed"}
            h={"full"}
            display={{ base: "none", md: "block" }}
            left={0}
            top={0}
          >
            <DrawerItems />
          </Box>
        </Container>
      </Box>
    );
  };

  const DrawerAdminMobile = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <Box>
        <IconButton
          icon={<FiMenu />}
          color={"white"}
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size={"xs"}
        >
          <DrawerContent bg={"#351734"}>
            <DrawerCloseButton color={"white"} />
            <DrawerItems onClose={onClose} />
          </DrawerContent>
        </Drawer>
      </Box>
    );
  };

  const DrawerItems = () => {
    const items = [
      "Users",
      "Warehouses",
      "Products",
      "Categories",
      "Order",
      "Reports",
    ];

    return (
      <Box>
        <Flex
          h={{ base: "20" }}
          alignItems={"center"}
          justifyContent={"center"}
          borderBottom={"1px solid white"}
        >
          <Image w={{ base: "auto" }} h={{ base: "10" }} src={mokomdo2} />
        </Flex>
        <Stack paddingTop={"2"}>
          {items.map((item, index) => {
            return (
              <Button
                key={index}
                borderRadius={0}
                color={"white"}
                bg={"none"}
                _hover={{ bg: "#C146ED" }}
                onClick={() => {
                  setContext(index);
                }}
              >
                {item}
              </Button>
            );
          })}
        </Stack>
      </Box>
    );
  };

  return (
    <Box bg={"white"}>
      <NavbarAdmin />
      <Box>
        <AdminBody tabNum={context} role={role} />
      </Box>
    </Box>
  );
};
