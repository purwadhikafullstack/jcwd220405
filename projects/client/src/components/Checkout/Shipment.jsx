import {
  Container,
  Box,
  Divider,
  Text,
  Button,
  Image,
  Select,
} from "@chakra-ui/react";
import gameboy from "../../assets/gameboy.jpg";

//react + redux + axios
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";

//base api
const port = process.env.REACT_APP_SERVER;
const baseApi = process.env.REACT_APP_API_BASE_URL;

//page
export const Shipment = () => {
  const [detail, setDetail] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [totalWeight, setTotalWeight] = useState("");
  const [service, setService] = useState([]);
  const { id } = useSelector((state) => state.userSlice.value);

  const getShipmentDetail = async () => {
    try {
      const result = await (await Axios.get(`${baseApi}/shipment/${id}`)).data;
      setDetail(result);

      // const userAddresFinal = result[0]?.User?.Address_Users[0]?.city_id;
      setUserAddress(result[0]?.User?.Address_Users[0]?.city_id);
      const sumWeight = result
        ?.map((item) => item?.quantity * item?.Product?.weight)
        .reduce((a, b) => a + b, 0);
      setTotalWeight(sumWeight);

      // const rajaOngkir = {
      //   origin: 153,
      //   destination: userAddresFinal,
      //   weight: sumWeight,
      //   courier: "jne",
      // };

      // const resultOngkir = await (
      //   await Axios.post(`${baseApi}/shipment/cost`, rajaOngkir)
      // ).data;

      // console.log(result);
      // setService(resultOngkir.costs);
    } catch (err) {
      console.log(err);
    }
  };

  const getCost = async () => {
    try {
      const rajaOngkir = {
        origin: 153,
        destination: userAddress,
        weight: totalWeight,
        courier: "jne",
      };
      const result = await (
        await Axios.post(`${baseApi}/shipment/cost`, rajaOngkir)
      ).data;
      console.log(result);
      setService(result[0].costs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getShipmentDetail();
    // getCost();
  }, [id]);

  // useEffect(() => {
  //   getCost();
  //   // getCost();
  // });

  console.log(service);
  return (
    <Box mt={5}>
      <Box>
        {detail?.map((item, index) => {
          console.log(item);
          return (
            <Box key={index}>
              <Box mb={5}>
                <Text>Gudang Dummy</Text>
                <Divider />
              </Box>
              <Box
                display={"flex"}
                flexDirection={{ base: "column", md: "row" }}
                mb={5}
              >
                <Box
                  maxW={20}
                  maxHeight={20}
                  mr={5}
                  border={"2px"}
                  borderRadius="lg"
                  borderColor={""}
                >
                  <Image
                    src={
                      item?.Product?.Product_Images[0]?.image
                        ? port + item?.Product?.Product_Images[0]?.image
                        : gameboy
                    }
                    alt="product"
                    w="inherit"
                  />
                </Box>
                <Box w={{ base: "100%", md: "70%" }} mt={2}>
                  <Text>{item?.Product?.name}</Text>
                  <Text mt={5}>
                    {item?.quantity} item ({item?.Product?.weight}gr/item)
                  </Text>
                  <Text mt={5}>Rp {item?.price?.toLocaleString()}</Text>
                </Box>
              </Box>
              <Divider />
            </Box>
          );
        })}
      </Box>
      <Box w={{ base: "100%", md: "70%" }}>
        <Box mb={2}>Shipment Courier : JNE</Box>
        <Box>
          <Select
            placeholder="Duration"
            colorScheme={"pink"}
            textColor="black"
            bg={"#D54B79"}
            // m="auto"
            mb={5}
            borderColor="gray"
            fontWeight={600}
            onClick={() => getCost()}
          >
            {service?.map((item, index) => {
              console.log(item);
              return (
                <option value={item} key={index} color="salmon">
                  {`Rp ${item?.cost[0]?.value.toLocaleString()} (estimasi tiba ${
                    item?.cost[0]?.etd
                  } hari)(Layanan : ${item?.service})`}{" "}
                </option>
              );
            })}
          </Select>
        </Box>
      </Box>
    </Box>
  );
};
