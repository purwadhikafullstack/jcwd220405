// react
import { useState, useEffect } from "react";

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

export const DrawerCompUser = () => {
  const [user, setUser] = useState();

  //   const User = () => {
  //     setUser("test");
  //   };

  useEffect(() => {
  }, [user]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        as={Avatar}
        size={"xl"}
        src={"https://bit.ly/broken-link"}
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
            <Box textAlign={"center"}>{user}</Box>
            <Box>
              <Center>
                <Avatar
                  size={{ base: "xl", lg: "xl" }}
                  src={"https://bit.ly/broken-link"}
                  bg="grey"
                />
              </Center>
            </Box>
          </DrawerHeader>
          <DrawerBody display={"flex"} flexDir={"column"}>
            {user ? (
              <Stack>
                <Button>Profile</Button>
                <Button>History</Button>
              </Stack>
            ) : (
              <Stack>
                <Button onClick={() => setUser("Jhonny")}>Sign In</Button>
                <Button>Sign Up</Button>
              </Stack>
            )}
          </DrawerBody>
          {user ? (
            <DrawerFooter borderTop={"1px solid black"}>
              {/* <Center> */}
                <Button
                  onClick={() => {
                    setUser();
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
