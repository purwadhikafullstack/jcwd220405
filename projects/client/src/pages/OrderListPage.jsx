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
  Spacer,
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
} from "@chakra-ui/react";
import { PaymentProof } from "../components/Button/PaymentButton";
import { IoBagHandleOutline } from "react-icons/io5";
import gameboy from "../assets/gameboy.jpg";
import mokomdo from "../assets/mokomdo-simplified2.png";

//react + redux + axios
import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";

//base api
const port = process.env.REACT_APP_SERVER;
const baseApi = process.env.REACT_APP_API_BASE_URL;

//page
export const OrderListPage = () => {
  const { id } = useSelector((state) => state.userSlice.value);
  const [isLoading, setisLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [statusName, setstatusName] = useState("");
  const [statusList, setStatusList] = useState([]);

  const getOrderList = useCallback(async () => {
    try {
      const result = await (
        await Axios.get(
          `${baseApi}/order-list/${id}?page=${page - 1}&status=${statusName}`
        )
      ).data;
      // console.log(result);
      setOrderList(result.result);
      setTotalPage(result.totalPage);
    } catch (err) {
      console.log(err);
    }
  }, [id, page, statusName]);

  const cancelOrder = async (item) => {
    try {
      setisLoading(true);
      await Axios.post(`${baseApi}/order-list/cancel/${id}`, { id: item.id });
      setisLoading(false);
      onClose();
      getOrderList();
    } catch (err) {
      console.log(err);
      setisLoading(false);
    }
  };

  const completeOrder = async (item) => {
    try {
      setisLoading(true);
      await Axios.post(`${baseApi}/order-list/complete/${id}`, { id: item.id });
      setisLoading(false);
      onClose();
      getOrderList();
    } catch (err) {
      console.log(err);
      setisLoading(false);
    }
  };

  const transactionStatusList = useCallback(async () => {
    try {
      const result = await (
        await Axios.get(`${baseApi}/order-list/l/statusList`)
      ).data;
      // console.log(result.result);
      setStatusList(result.result);
    } catch (err) {
      console.log(err);
    }
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

  return (
    <Container maxW={"80%"}>
      <Box>
        <Text fontSize="4xl" color={"white"}>
          Order List
        </Text>
        <Divider />
        <Box mt={4}>
          <Select
            bgColor={"white"}
            // color={"white"}
            placeholder={statusName ? "Reset" : "--Select Transaction--"}
            onChange={(e) => {
              console.log(e.target.value);
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
              console.log(item);
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
                  >
                    <IoBagHandleOutline size={"25px"} />
                    <Text ml={3}>{item?.invoice}</Text>
                    <Spacer />

                    <Box
                      color={"black"}
                      display="flex"
                      bgColor="#D0BDAC"
                      border={"0.1px"}
                      borderRadius={5}
                      // p={1}
                      pb={1}
                      px={1}
                    >
                      <Text>{item?.Order_Status?.status}</Text>
                    </Box>
                  </Box>
                  <Card direction={"row"} variant="ghost">
                    <Box w={"130px"} h={"150px"}>
                      <Image
                        src={
                          item?.Transaction_Product_Warehouses[0]?.Product
                            ?.Product_Images[0]?.image
                            ? port +
                              item?.Transaction_Product_Warehouses[0]?.Product
                                ?.Product_Images[0]?.image
                            : gameboy
                        }
                        h="inherit"
                        w="inherit"
                        borderRadius={10}
                        objectFit="cover"
                        alt="This is photo of product"
                      />
                    </Box>

                    <CardBody my={0}>
                      <Stack>
                        <Heading size={"md"} color="black">
                          {
                            item?.Transaction_Product_Warehouses[0]?.Product
                              ?.name
                          }
                        </Heading>
                        <Text py={2} color="black">
                          {item?.Transaction_Product_Warehouses[0]?.quantity} X{" "}
                          {item?.Transaction_Product_Warehouses[0]?.price}
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
                    />
                    <CardBody my={0}>
                      <Stack color="black">
                        <Text>Total Belanja</Text>
                        <Text>Rp {item?.total_price}</Text>
                      </Stack>
                    </CardBody>
                  </Card>
                  <CardFooter
                    // border={"2px"}
                    p={0}
                    pb={3}
                    pr={3}
                  >
                    {item?.OrderStatusId > 1 ? (
                      <Box
                        display={"flex"}
                        justifyContent="space-between"
                        hidden={item?.OrderStatusId === 6 ? true : false}
                        // border="2px"
                        width={"100%"}
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
                        <Spacer />

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
                          onClick={onOpen}
                        >
                          Selesaikan Pesanan
                        </Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              <Center>Cancel Order</Center>
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              Are you sure you want to complete this order?
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                onClick={() => completeOrder(item)}
                                isLoading={isLoading}
                                loadingText="Sending"
                              >
                                Yes
                              </Button>
                              <Button onClick={onClose} ml={5} bg="#D54B79">
                                Cancel
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </Box>
                    ) : (
                      <>
                        <PaymentProof id={item?.id} />
                        <Spacer />
                        <Button
                          variant={"solid"}
                          bg="#D54B79"
                          color={"black"}
                          onClick={onOpen}
                        >
                          Cancel Order
                        </Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              <Center>Cancel Order</Center>
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              Are you sure you want to cancel this order?
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                onClick={() => cancelOrder(item)}
                                isLoading={isLoading}
                                loadingText="Sending"
                              >
                                Yes
                              </Button>
                              <Button onClick={onClose} ml={5} bg="#D54B79">
                                Cancel
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </>
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
            // margin="auto"
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
  );
};
