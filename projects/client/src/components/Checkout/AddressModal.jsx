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
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { IoCheckmarkOutline } from "react-icons/io5";
import { AddAddress } from "../Address/AddressSettings";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const AddressModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [address, setAddress] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const { id } = useSelector((state) => state.userSlice.value);

  const handleQuery = () => setQuery(search);

  const getAddress = async () => {
    try {
      const result = await (
        await Axios.get(
          `${baseApi}/address/${id}?search_query=${query ? query : ""}`
        )
      ).data;
      setAddress(result);
    } catch (err) {
      console.log(err);
    }
  };

  const selectAddress = async (item) => {
    try {
      await Axios.post(`${baseApi}/address/s/${id}`, { id: item.id });
      getAddress();
      onClose();
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Address change successfuly",
            status: "success",
            isClosable: true,
          }),
        100
      );
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAddress();
  }, [id, query]);

  return (
    <>
      <Button onClick={onOpen} color="black" bg={"#D54B79"} m="auto" mb={5}>
        Other address
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size={{ base: "md", md: "2xl" }}
      >
        <ModalOverlay />

        <ModalContent
          maxW={"50%"}
          bgColor="#68185F"
          bgGradient="linear-gradient(133.91deg, rgba(38, 4, 37, 0.28) 0%, #6B1857 98.16%)"
        >
          <Box mb={3}>
            <ModalCloseButton />
          </Box>
          <ModalHeader>
            <Center color={"white"}>Address List</Center>
            <Box mt={5}>
              <InputGroup>
                <InputLeftElement children={<IoSearch />} color="white" />
                <Input
                  color={"white"}
                  placeholder={"Search for recipient address or name"}
                  _placeholder={{ fontSize: { base: "13px", md: "13px" } }}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleQuery();
                      e.preventDefault();
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Backspace") {
                      handleQuery();
                    }
                  }}
                />
              </InputGroup>
              <Box mt={5}>
                <Center>
                  <AddAddress />
                </Center>
              </Box>
            </Box>
          </ModalHeader>

          <ModalBody pb={10}>
            {address?.map((item, index) => {
              return (
                <Box
                  key={index}
                  border={"2px"}
                  borderRadius="md"
                  borderColor={"rgba(231, 56, 145,.69)"}
                  bgColor={"rgba(231, 56, 145,.234)"}
                  m={"auto"}
                  mb={6}
                >
                  <Box p={5} color="white">
                    <Text>{item?.received_name}</Text>
                    <Text>{item?.full_address}</Text>
                    <Text>
                      {item?.city_type}, {item?.city}
                    </Text>
                    <Text>
                      {item?.province}, {item?.postal_code}
                    </Text>
                    <Box mt={5} display="flex" flexDirection={"row-reverse"}>
                      {item.status ? (
                        <IoCheckmarkOutline
                          transform="scale(2.2)"
                          color="snow"
                        />
                      ) : (
                        <Button
                          size={"sm"}
                          color="black"
                          onClick={() => selectAddress(item)}
                        >
                          Change
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
