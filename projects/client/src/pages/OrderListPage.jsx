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
  useToast,
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
} from "@chakra-ui/react";
import { IoBagHandleOutline } from "react-icons/io5";
import gameboy from "../assets/gameboy.jpg";
import mokomdo from "../assets/mokomdo-simplified2.png";

//react + redux + axios
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";

//base api
const port = process.env.REACT_APP_SERVER;
const baseApi = process.env.REACT_APP_API_BASE_URL;

//page
export const OrderListPage = () => {
  const [isLoading, setisLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useSelector((state) => state.userSlice.value);

  const getOrderList = async () => {
    try {
      const result = await (
        await Axios.get(`${baseApi}/order-list/${id}`)
      ).data;
      console.log(result);
      setOrderList(result);
    } catch (err) {
      console.log(err);
    }
  };

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

  useEffect(() => {
    getOrderList();
  }, [id]);

  return (
    <Container maxW={"80%"}>
      <Box ml={10} mt={20}>
        <Text fontSize="4xl" color={"white"}>
          Order List
        </Text>
        <Divider />
      </Box>
      {orderList?.length ? (
        <Box
          // display={"flex"}
          // justifyContent={"space-between"}
          bg="#FFF0F5"
          p={10}
          m={10}
          borderRadius={10}
          borderColor={"rgba(231, 56, 145,.234)"}
          maxW={"100%"}
        >
          <Flex direction={"column-reverse"}>
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
                          item?.Cart?.Product?.Product_Images[0]?.image
                            ? port +
                              item?.Cart?.Product?.Product_Images[0]?.image
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
                        <Heading size={"md"}>{item?.Cart.Product.name}</Heading>
                        <Text py={2}>
                          {item?.Cart?.quantity} X {item?.Cart?.price}
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
                      <Stack>
                        <Text>Total Belanja</Text>
                        <Text>Rp {item?.total_price}</Text>
                      </Stack>
                    </CardBody>
                  </Card>
                  <CardFooter p={0} pb={3} pr={3}>
                    <Spacer />
                    {item?.OrderStatusId > 1 ? (
                      <Button variant={"ghost"}></Button>
                    ) : (
                      <>
                        <Button
                          variant={"solid"}
                          bg="#D54B79"
                          color={"black"}
                          onClick={onOpen}
                        >
                          Batalkan Pesanan
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
    </Container>
  );
};
