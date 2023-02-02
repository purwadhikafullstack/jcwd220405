import {
  Container,
  Box,
  Divider,
  Text,
  Button,
  Image,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import gameboy from "../../assets/gameboy.jpg";
import { ShoppingSummary } from "./ShoppingSummary";

//react + redux + axios
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useRef } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

//base api
const port = process.env.REACT_APP_SERVER;
const baseApi = process.env.REACT_APP_API_BASE_URL;

//page
export const Shipment = () => {
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.userSlice.value);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [detail, setDetail] = useState([]); //result cart
  const [service, setService] = useState([]); //rajaongkir
  // const [product, setProduct] = useState([]);
  const [userAddress, setUserAddress] = useState(""); //origincity_id
  const [totalWeight, setTotalWeight] = useState(""); //totalweight untuk raja ongkir
  const [deliveryFee, setDeliveryFee] = useState(0); //delivery_fee dari raja ongkir
  const [userAddressID, setUserAddressID] = useState(""); //idAddress yang status 1
  const [cartID, setCartID] = useState(""); //idCart
  const [totalQuantity, setTotalQuantity] = useState(0);
  // const [quantity, setQuantity] = useState("");
  const [productPricetotal, setProductPriceTotal] = useState(0); //harga produk x quantity
  const [finalPrice, setFinalPrice] = useState(""); //price total + deliver fee
  const ongkirTotal = useRef("");

  const getCost = useCallback(async () => {
    try {
      const result = await (await Axios.get(`${baseApi}/shipment/${id}`)).data;
      console.log(result);
      setDetail(result);
      setUserAddress(result[0]?.User?.Address_Users[0]?.city_id);
      setUserAddressID(result[0]?.User?.Address_Users[0]?.id);
      setCartID(result[0]?.id);
      // setQuantity(result[0]?.quantity);

      const sumQty = result
        ?.map((item) => item?.quantity)
        .reduce((a, b) => a + b, 0);
      setTotalQuantity(sumQty);

      const sumWeight = result
        ?.map((item) => item?.quantity * item?.Product?.weight)
        .reduce((a, b) => a + b, 0);
      setTotalWeight(sumWeight);

      const sumPriceTotal = result
        ?.map((item) => item?.quantity * item?.price)
        .reduce((a, b) => a + b, 0);
      setProductPriceTotal(sumPriceTotal);
      console.log(productPricetotal);

      const sumfinalPrice = parseInt(productPricetotal) + parseInt(deliveryFee);
      setFinalPrice(sumfinalPrice);

      const rajaOngkir = {
        origin: 153,
        destination: userAddress,
        weight: totalWeight,
        courier: "jne",
      };

      // console.log(rajaOngkir);

      const resultOngkir = await (
        await Axios.post(`${baseApi}/shipment/cost`, rajaOngkir)
      ).data;

      // console.log(resultOngkir);

      // console.log(resultOngkir[0].costs[0]?.cost[0]?.value);
      setService(resultOngkir[0].costs);
      // setDeliveryFee(resultOngkir[0]?.costs[0]?.cost[0]?.value);
      // console.log(deliveryFee);
    } catch (err) {
      console.log(err);
    }
  }, [
    totalWeight,
    id,
    userAddress,
    productPricetotal,
    deliveryFee,
    // totalQuantity,
  ]);

  const createOrder = useCallback(async () => {
    try {
      const transactionData = {
        delivery_fee: deliveryFee,
        total_price: productPricetotal,
        CartId: cartID,
        final_price: finalPrice,
        IdAddress: userAddressID,
      };
      const resultCreateOrder = await Axios.post(
        `${baseApi}/createOrder/${id}`,
        transactionData
      );
      console.log(resultCreateOrder);
      Swal.fire({
        icon: "success",
        title: "Payment on Process",
        text: `${resultCreateOrder.data}`,

        customClass: {
          container: "my-swal",
        },
      });
      navigate("/order-list");
    } catch (err) {
      console.log(err);
    }
  }, [
    cartID,
    deliveryFee,
    productPricetotal,
    id,
    finalPrice,
    userAddressID,
    navigate,
  ]);

  useEffect(() => {
    getCost();
  }, [getCost, createOrder]);

  // console.log(service);
  return (
    <Box>
      <>
        <Box mt={5}>
          <Box>
            {detail?.map((item, index) => {
              // console.log(item);
              return (
                <Box key={index}>
                  <Box mb={5}>
                    <Text>Gudang Dummy</Text>
                    <Divider borderTop={"1px"} borderBottom={"2px"} />
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
                  {/* <Divider borderTop={"1px"} borderBottom={"2px"} /> */}
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
                // onClick={() => getCost()}
                onChange={() =>
                  setDeliveryFee(parseInt(ongkirTotal.current.value))
                }
                ref={ongkirTotal}
              >
                {service?.map((item, index) => {
                  // console.log(item?.cost[0]?.value);
                  return (
                    <option
                      value={item?.cost[0]?.value}
                      key={index}
                      color="salmon"
                    >
                      {`Rp ${item?.cost[0]?.value.toLocaleString()} (estimasi tiba ${
                        item?.cost[0]?.etd
                      } hari)(${item?.service})`}
                    </option>
                  );
                })}
              </Select>
            </Box>
          </Box>
        </Box>
      </>
      {/* order */}
      <>
        <Box mt={5}>
          <Box>
            <Text mb={7}>
              Make sure your address and shipment method is correct before
              finalizing transaction!
            </Text>
            <ShoppingSummary
              finalPrice={finalPrice}
              productPriceTotal={productPricetotal}
              deliveryFee={deliveryFee}
              quantity={totalQuantity}
            />
          </Box>
          <Box mt={5} w={{ base: "100%", md: "70%" }}>
            {deliveryFee ? (
              <Button
                colorScheme={"pink"}
                textColor="black"
                bg={"#D54B79"}
                // m="auto"
                mb={5}
                borderColor="gray"
                fontWeight={600}
                onClick={onOpen}
              >
                Pembayaran
              </Button>
            ) : (
              <Button
                onClick={() =>
                  Swal.fire({
                    icon: "error",
                    title: "Failed Attempt",
                    text: `Please choose your shipment method`,

                    customClass: {
                      container: "my-swal",
                    },
                  })
                }
                textColor="black"
                bg={"#D54B79"}
              >
                Pembayaran
              </Button>
            )}

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent bgGradient="linear(150.64deg, #3B0D2C 0%, rgba(74, 10, 71, 1) 16.61%, #2F0C39 61.16%, rgba(38, 8, 67, 1)  92.29%)">
                <ModalHeader color={"salmon"}>Pembayaran</ModalHeader>
                <ModalCloseButton color={"white"} />
                <ModalBody>
                  <RadioGroup>
                    <Box
                      border={"2px"}
                      borderRadius="5px"
                      p={5}
                      mb={3}
                      borderColor="gray"
                      color={"white"}
                    >
                      <Radio
                        colorScheme={"pink"}
                        // value={payment}
                        defaultChecked
                      >
                        Transfer Bank
                      </Radio>
                    </Box>
                    <Box
                      border={"2px"}
                      borderRadius="5px"
                      p={5}
                      borderColor="gray"
                      color={"white"}
                    >
                      <Radio isDisabled>Lainnya (Coming Soon)</Radio>
                    </Box>
                  </RadioGroup>
                  <Box mt={5}>
                    <ShoppingSummary
                      // getCost={getCost}
                      finalPrice={finalPrice}
                      productPriceTotal={productPricetotal}
                      deliveryFee={deliveryFee}
                      quantity={totalQuantity}
                    />
                  </Box>
                </ModalBody>
                <ModalFooter>
                  <Button
                    textColor="black"
                    bg={"#D54B79"}
                    onClick={() => createOrder()}
                  >
                    Bayar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Box>
      </>
    </Box>
  );
};
