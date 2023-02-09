import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const ReVerifyButton = ({ user, baseApi, toast }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [check, setCheck] = useState("");
  const [show, setShow] = useState("");
  const [isLoading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      const response = await (
        await axios.post(`${baseApi}/user/send-otp/${user.id}`)
      ).data;
      setShow(response.status);
      return toast({
        position: "top",
        title: "Please check your email",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      setShow(error.response.data);
      return toast({
        position: "top",
        title: "Please check your email",
        status: "info",
        isClosable: true,
      });
    }
  };

  const signOtp = async () => {
    try {
      setLoading(true);
      await axios.post(`${baseApi}/user/sign-otp/${user.id}`, {
        check,
      });
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Success Verify",
            status: "success",
            isClosable: true,
          }),
        1000
      );
      setTimeout(() => setLoading(false), 2000);
      setTimeout(() => window.location.reload(), 2500);
    } catch (error) {
      console.log(error);
      setLoading(false);
      return toast({
        position: "top",
        title: `${error.response.data}`,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Text
        as={Link}
        color="#D54B79"
        hidden={user?.is_verified ? true : false}
        onClick={() => {
          sendOtp();
          onOpen();
        }}
      >
        Now
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Verify Email</ModalHeader>
          <ModalCloseButton />
          <Box hidden={show ? true : false} pb={"5"}>
            <Center>Please check your email</Center>
          </Box>
          <Box hidden={show ? false : true}>
            <ModalBody pb={"5"}>
              <Box mb={"5"}>
                <Center fontSize={{ base: "sm", sm: "md" }}>
                  We have sent code to your email
                </Center>
                <Center fontSize={{ base: "sm", sm: "md" }} fontWeight="bold">
                  {user?.email}
                </Center>
              </Box>
              <FormControl>
                <Center>
                  <HStack>
                    <PinInput onChange={(e) => setCheck(e)}>
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </Center>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                variant={"outline"}
                m={"auto"}
                onClick={() => signOtp()}
                isDisabled={check ? false : true}
                isLoading={isLoading}
              >
                Send
              </Button>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
