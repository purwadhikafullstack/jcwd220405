import { Container, Box, Divider, Text, Button } from "@chakra-ui/react";
import { AddressModal } from "./AddressModal";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const AddressList = () => {
  const [address, setAddress] = useState([]);
  const { id } = useSelector((state) => state.userSlice.value);

  const defaultAddress = async () => {
    try {
      const result = await (await Axios.get(`${baseApi}/address/${id}`)).data;

      setAddress(result);
      // console.log(address);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    defaultAddress();
  }, [id]);

  return (
    <>
      <Box mt={8}>
        <Text fontSize={"2xl"}>Shipping Address</Text>
        <Divider mt={"1"} borderTop={"1px"} borderBottom={"2px"} />
        <Box>
          <Text fontSize={"xl"} mb={2} mt={2}>
            {address[0]?.received_name}
          </Text>
        </Box>
        <Box my={5}>
          <Text>{address[0]?.full_address}</Text>
          <Text>
            {address[0]?.city_type}, {address[0]?.city}
          </Text>
          <Text>
            {address[0]?.province}, {address[0]?.postal_code}
          </Text>
        </Box>
        <Divider mt={"1"} borderTop={"1px"} borderBottom={"2px"} />
      </Box>
      <Box mt={7}>
        <AddressModal />
      </Box>
    </>
  );
};
