import {
  Badge,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useToast,
} from "@chakra-ui/react";
import { IoSearch, IoCheckmarkOutline } from "react-icons/io5";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { AddAddress, DeleteAddress, EditAddress } from "./AddressSettings";
import { useSelector } from "react-redux";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const Address = () => {
  const toast = useToast();
  const [address, setAddress] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const { id } = useSelector((state) => state.userSlice.value);

  const handleQuery = () => setQuery(search);

  const getAddressUser = async () => {
    try {
      // masih nembak lewat params, niatnya ambil user dari redux
      const response = await (
        await axios.get(
          `${baseApi}/address/${id}?search_query=${query ? query : ""}`
        )
      ).data;
      setAddress(response);
    } catch (error) {
      console.log(error);
    }
  };

  const selectAddress = async (item) => {
    try {
      // masih nembak lewat params, niatnya ambil user dari redux
      await axios.post(`${baseApi}/address/s/${id}`, { id: item.id });
      setTimeout(
        () =>
          toast({
            position: "top",
            title:
              "Address selected successfully. Enjoy a shopping experience that matches your address!",
            status: "success",
            variant: "subtle",
            isClosable: true,
          }),
        1500
      );
      setTimeout(() => getAddressUser(), 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAddressUser();
  }, [query, id]);
  return (
    <>
      <Flex
        justifyContent={"space-between"}
        direction={{ base: "column", md: "row" }}
        gap={{ base: "3", md: "5" }}
      >
        <Box flex={".5"}>
          <InputGroup>
            <Input
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
            <InputRightAddon bgColor={"#E73891"} border={"##E73891"} w={"10%"}>
              <Button
                bgColor={"transparent"}
                pos={"absolute"}
                right={{ base: "-.6em", md: "-.8em" }}
                // right={"-.7em"}
                variant={"unstyled"}
                onClick={handleQuery}
                disabled={search ? false : true}
              >
                <IoSearch />
              </Button>
            </InputRightAddon>
          </InputGroup>
        </Box>
        <Box>
          <AddAddress
            address={address}
            baseApi={baseApi}
            search={query}
            id={id}
          />
        </Box>
      </Flex>
      <Flex direction={"column"}>
        {address?.map((item, index) => {
          return (
            <Box
              key={index}
              borderRadius={"md"}
              border={"2px"}
              borderColor={
                item.status ? "rgba(231, 56, 145,.69)" : "transparent"
              }
              bgColor={item.status ? "rgba(231, 56, 145,.234)" : ""}
              bgGradient={
                item.status
                  ? ""
                  : "linear(to-r, rgba(231, 56, 145, 0.33) 55.88%, rgba(233, 54, 188, 0.44) 100%)"
              }
              mt={{ base: "6", md: "8" }}
              p={6}
              pt={0}
              pb={0}
              display={"flex"}
              flexDirection={"column"}
              gap={3}
            >
              <Box pt={2} display={"flex"} gap={2}>
                <Text color={"gray.500"} fontWeight={"medium"}>
                  Address
                </Text>
                <Badge
                  variant={"outline"}
                  colorScheme={"gray"}
                  pt={1}
                  hidden={item.status ? false : true}
                >
                  Main
                </Badge>
              </Box>
              <Box>
                <Flex justifyContent={"space-between"}>
                  <Box>
                    <Text
                      fontWeight={"semibold"}
                      fontSize={{ base: "16px", md: "20px" }}
                    >
                      {item.received_name}
                    </Text>
                    <Text>{item.full_address}</Text>
                  </Box>
                  <Box pt={"3.5"}>
                    {item.status ? (
                      <IoCheckmarkOutline
                        transform="scale(2.2)"
                        color="rgba(231, 56, 145,1)"
                      />
                    ) : (
                      <Button
                        colorScheme={"pink"}
                        size={"sm"}
                        onClick={() => selectAddress(item)}
                      >
                        Select
                      </Button>
                    )}
                  </Box>
                </Flex>
              </Box>
              <Box mb={3} color={"#E73891"} display={"flex"} gap={4}>
                <EditAddress
                  address={address}
                  baseApi={baseApi}
                  item={item}
                  id={id}
                />
                <Text
                  as={"span"}
                  color="gray.500"
                  hidden={item.status ? true : false}
                >
                  {"|"}
                </Text>
                <DeleteAddress
                  item={item}
                  getAddressUser={getAddressUser}
                  baseApi={baseApi}
                  id={id}
                />
              </Box>
            </Box>
          );
        })}
      </Flex>
      <Box textAlign={"center"} mt="4">
        {!address?.length && query
          ? "Address not found"
          : !address?.length
          ? "Please add your address"
          : ""}
      </Box>
    </>
  );
};
