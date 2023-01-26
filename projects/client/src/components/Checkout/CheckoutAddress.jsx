import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Center,
  ModalCloseButton,
  InputGroup,
  InputLeftElement,
  Input,
  ModalBody,
  Text,
  useToast,
  Container,
  Heading,
} from "@chakra-ui/react";
import { AddressList } from "./AddressList";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const CheckoutAddress = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const { id } = useSelector((state) => state.userSlice.value);

  const checkAddress = async () => {
    try {
      const result = await (await Axios.get(`${baseApi}/address/${id}`)).data;
      setAddress(result);
    } catch (err) {
      console.log(err);
    }
  };

  const onClick = () => {
    try {
      navigate("/profile/settings/address");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkAddress();
  }, [id]);

  return (
    <>
      <Container
        maxWidth={"80%"}
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
        bgGradient="linear(150.64deg, #3B0D2C 0%, rgba(74, 10, 71, 1) 16.61%, #2F0C39 61.16%, rgba(38, 8, 67, 1)  92.29%)"
        color={"white"}
        border={"2px"}
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Box width={{ base: "100%", md: "70%" }} p={2}>
          <Box
            display={"flex"}
            flexDirection={{ base: "column", md: "row" }}
            gap={"4"}
          >
            <Heading color={"salmon"}>Checkout</Heading>
          </Box>
          {address?.length ? (
            <AddressList />
          ) : (
            <Box mt={8}>
              <Box>
                <Text>
                  You dont have an address yet, you can add address in your
                  profile setting
                </Text>
                <Text>Or</Text>
                <Text>click below!</Text>
              </Box>
              <Box mt={8} display="flex">
                <Button color={"black"} onClick={onClick}>
                  Click Here
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};
