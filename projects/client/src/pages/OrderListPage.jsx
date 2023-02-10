//chakra + icon + assets
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  Card,
  CardBody,
  Image,
  Stack,
  CardFooter,
  Modal,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Center,
  Divider,
  Container,
  Select,
  useMediaQuery,
} from "@chakra-ui/react";
import { PaymentProof } from "../components/Button/PaymentButton";
import { IoBagHandleOutline } from "react-icons/io5";
import gameboy from "../assets/gameboy.jpg";
import mokomdo from "../assets/mokomdo-simplified2.png";
import swal from "sweetalert";

//react + redux + axios
import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";

import { NavbarComp } from "../components/Navbar";
import { Footer } from "../components/Footer";

//base api
const port = process.env.REACT_APP_SERVER;
const baseApi = process.env.REACT_APP_API_BASE_URL;

//page
export const OrderListPage = () => {
  const { id } = useSelector((state) => state.userSlice.value);
  const [isLoading, setisLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [statusName, setstatusName] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [setDir] = useMediaQuery("(max-width: 579px)");

  const getOrderList = useCallback(async () => {
    try {
      const result = await (
        await Axios.get(
          `${baseApi}/order-list/${id}?page=${page - 1}&status=${statusName}`
        )
      ).data;
      setOrderList(result.result);
      setTotalPage(result.totalPage);
    } catch (err) {}
  }, [id, page, statusName]);

  const cancelOrder = async (item) => {
    try {
      const once = await swal("Cancel this order?", {
        dangerMode: true,
        buttons: true,
      });
      if (once) {
        setisLoading(true);
        await Axios.post(`${baseApi}/order-list/cancel/${id}`, { id: item.id });
        setisLoading(false);
        getOrderList();
      }
    } catch (err) {
      setisLoading(false);
    }
  };

  const completeOrder = async (item) => {
    try {
      const once = await swal("Complete this order?", {
        dangerMode: true,
        buttons: true,
      });
      if (once) {
        setisLoading(true);
        await Axios.post(`${baseApi}/order-list/complete/${id}`, {
          id: item.id,
        });
        setisLoading(false);
        getOrderList();
      }
    } catch (err) {
      setisLoading(false);
    }
  };

  const transactionStatusList = useCallback(async () => {
    try {
      const result = await (
        await Axios.get(`${baseApi}/order-list/l/statusList`)
      ).data;
      setStatusList(result.result);
    } catch (err) {}
  }, []);

  const renderStatusList = () => {
    return statusList.map((item, index) => {
      return (
        <option value={item.id} key={index}>
          {item.status}
        </option>
      );
    });
  };

  useEffect(() => {
    getOrderList();
    transactionStatusList();
  }, [getOrderList, transactionStatusList]);

  const minString = (str, num) => {
    if (str?.length > num) return str.slice(0, num) + "...";
    return str;
  };

  return (
    <>
      <NavbarComp />
      <Container maxW={{ base: "100%", md: "80%" }}>
        <Box>
          <Text fontSize="4xl" color={"white"}>
            Order List
          </Text>
          <Divider />
          <Box mt={4}>
            <Select
              bgColor={"white"}
              placeholder={statusName ? "Reset" : "--Select Transaction--"}
              onChange={(e) => {
                setstatusName(e.target.value);
                setPage(1);
              }}
              textColor="black"
            >
              {renderStatusList()}
            </Select>
          </Box>
        </Box>
        {orderList?.length ? (
          <Box
            bgGradient="linear(150.64deg, #3B0D2C 0%, rgba(74, 10, 71, 1) 16.61%, #2F0C39 61.16%, rgba(38, 8, 67, 1)  92.29%)"
            p={5}
            m={5}
            borderRadius={10}
            borderColor={"rgba(231, 56, 145,.234)"}
            maxW={"100%"}
          >
            <Flex direction={"column"}>
              {orderList?.map((item, index) => {
                return (
                  <Card
                    key={index}
                    mb={10}
                    border={"2px"}
                    borderRadius={10}
                    borderColor={"rgba(231, 56, 145,.234)"}
                    maxH={"100%"}
                    bgColor="white"
                  >
                    <Box
                      mb={2}
                      display="flex"
                      p={1}
                      bg="#440F5D"
                      color={"white"}
                      borderTopRadius={10}
                      h={35}
                      justifyContent={"space-between"}
                      gap={{ base: "2", md: "4" }}
                    >
                      <Box display={"flex"} gap={{ base: "2", md: "4" }}>
                        <Box>
                          <IoBagHandleOutline size={"25px"} />
                        </Box>
                        <Box>
                          <Text>{item?.invoice}</Text>
                        </Box>
                      </Box>
                      <Box
                        color={"black"}
                        display="flex"
                        bgColor="#D0BDAC"
                        border={"0.1px"}
                        borderRadius={5}
                        pb={1}
                        px={1}
                        overflow={setDir ? "auto" : ""}
                      >
                        <Text>{item?.Order_Status?.status}</Text>
                      </Box>
                    </Box>
                    <Card direction={setDir ? "column" : "row"} variant="ghost">
                      <Box
                        w={setDir ? "100%" : "130px"}
                        h={setDir ? "100%" : "150px"}
                      >
                        <Image
                          src={
                            item?.Transaction_Product_Warehouses[0]?.Product
                              ?.Product_Images[0]?.image
                              ? port +
                                item?.Transaction_Product_Warehouses[0]?.Product
                                  ?.Product_Images[0]?.image
                              : gameboy
                          }
                          w={setDir ? "60%" : "130px"}
                          h={setDir ? "60%" : "150px"}
                          m={setDir ? "auto" : ""}
                          borderRadius={10}
                          objectFit="cover"
                          alt="This is photo of product"
                        />
                      </Box>
                      <CardBody my={0}>
                        <Stack>
                          <Heading size={"md"} color="black">
                            {setDir
                              ? minString(
                                  item?.Transaction_Product_Warehouses[0]
                                    ?.Product?.name,
                                  40
                                )
                              : item?.Transaction_Product_Warehouses[0]?.Product
                                  ?.name}
                          </Heading>
                          <Text py={2} color="black">
                            {item?.Transaction_Product_Warehouses[0]?.quantity}{" "}
                            X{" "}
                            {item?.Transaction_Product_Warehouses[0]?.price?.toLocaleString()}
                          </Text>
                          <Text
                            hidden={
                              item?.Transaction_Product_Warehouses?.length < 2
                                ? true
                                : false
                            }
                          >
                            +{item?.Transaction_Product_Warehouses.length - 1}{" "}
                            produk lain
                          </Text>
                        </Stack>
                      </CardBody>
                      <Divider
                        bgColor={"black"}
                        borderWidth={1}
                        borderColor="black"
                        color="black"
                        orientation="vertical"
                        height={"40"}
                        hidden={setDir ? true : false}
                      />
                      <Box my={0} px={4} pt={setDir ? "0" : "4"} mb={"4"}>
                        <Stack
                          color="black"
                          direction={setDir ? "row" : "column"}
                        >
                          <Text>Total Belanja</Text>
                          <Text>Rp{item?.total_price?.toLocaleString()}</Text>
                        </Stack>
                      </Box>
                    </Card>
                    <CardFooter p={0} pb={3} pr={3}>
                      {item?.OrderStatusId > 1 ? (
                        <Box
                          display={"flex"}
                          justifyContent="space-between"
                          hidden={item?.OrderStatusId === 6 ? true : false}
                          width={"100%"}
                          flexDirection={setDir ? "column" : "row"}
                          pl={"2"}
                          gap="4"
                        >
                          <Button
                            variant={"solid"}
                            bg="#D54B79"
                            color={"black"}
                            isDisabled
                            hidden={item?.OrderStatusId > 3 ? true : false}
                          >
                            Uploaded
                          </Button>
                          <Button
                            variant={"solid"}
                            bg="#D54B79"
                            color={"black"}
                            isDisabled
                            hidden={item?.OrderStatusId > 3 ? true : false}
                          >
                            Cancel Order
                          </Button>
                          <Button
                            hidden={item?.OrderStatusId === 4 ? false : true}
                            variant={"solid"}
                            bg="#D54B79"
                            color={"black"}
                            onClick={() => completeOrder(item)}
                          >
                            Complete Order
                          </Button>
                        </Box>
                      ) : (
                        <Box
                          display={"flex"}
                          justifyContent="space-between"
                          flexDirection={setDir ? "column" : "row"}
                          width={"100%"}
                          pl={"2"}
                        >
                          <PaymentProof
                            id={item?.id}
                            setDir={setDir}
                            minString={minString}
                          />
                          <Button
                            variant={"solid"}
                            bg="#D54B79"
                            color={"black"}
                            onClick={() => {
                              cancelOrder(item);
                            }}
                          >
                            Cancel Order
                          </Button>
                        </Box>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </Flex>
          </Box>
        ) : (
          <Box display={"flex"} justifyContent={"center"}>
            <Box
              display={"grid"}
              justifyContent={"center"}
              bg="#FFF0F5"
              p={10}
              my={50}
              borderRadius={10}
              borderColor={"rgba(231, 56, 145,.234)"}
              maxW={"100%"}
              h={"200px"}
              w={"1000px"}
              flexDirection={"column"}
            >
              <Box>
                <Image position={"center"} src={mokomdo} />
              </Box>
              <Box>
                <Text>You dont have any transaction yet</Text>
              </Box>
            </Box>
          </Box>
        )}

        <Box
          display="flex"
          justifyContent="center"
          alignContent="center"
          gap={3}
          mb={3}
          hidden={orderList.length < 1 ? true : false}
        >
          <Button
            onClick={() => {
              setPage(page - 1);
            }}
            disabled={page === 1 ? true : false}
            size={{ base: "sm", md: "md" }}
            borderColor="rgb(213, 75, 121)"
            borderRadius=".6em"
            borderWidth="2px"
            bgColor="white"
            _hover={{ bg: "rgb(213, 75, 121)" }}
            _active={{ bg: "none" }}
          >
            {"Prev"}
          </Button>
          <Text alignSelf="center" color={"white"}>
            {" "}
            {page} of {totalPage}
          </Text>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPage ? true : false}
            size={{ base: "sm", md: "md" }}
            borderColor="rgb(213, 75, 121)"
            borderRadius=".6em"
            borderWidth="2px"
            bgColor="white"
            _hover={{ bg: "rgb(213, 75, 121)" }}
            _active={{ bg: "none" }}
          >
            {"Next"}
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};
