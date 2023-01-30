import {
  Container,
  Box,
  Divider,
  Text,
  Button,
  Image,
  Select,
  Spacer,
  GridItem,
  ListItem,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  RadioGroup,
  Radio,
  Heading,
} from "@chakra-ui/react";
import { ShoppingSummary } from "./ShoppingSummary";
import gameboy from "../../assets/gameboy.jpg";

//react + redux + axios
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { useCallback } from "react";

//base api
const port = process.env.REACT_APP_SERVER;
const baseApi = process.env.REACT_APP_API_BASE_URL;

export const Order = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [userAddress, setUserAddress] = useState([]);
  const [cart, setCart] = useState([]);
  const [productPricetotal, setProductPriceTotal] = useState([]);
  const [payment, setPayment] = useState("");
  const { id } = useSelector((state) => state.userSlice.value);

  const getFinal = useCallback(async () => {
    try {
      const resultAddress = await (
        await Axios.get(`${baseApi}/shipment/${id}}`)
      ).data;
      console.log(resultAddress);

      setUserAddress(resultAddress[0]?.User?.Address_Users[0]?.id);
      console.log(userAddress);

      setCart(resultAddress[0]?.id);
      console.log(cart);

      const ProductPriceTotal = resultAddress
        ?.map((item) => item?.quantity * item?.price)
        .reduce((a, b) => a + b, 0);

      setProductPriceTotal(ProductPriceTotal);
      console.log(productPricetotal);
    } catch (err) {
      console.log(err);
    }
  }, [id, userAddress, cart, productPricetotal]);

  useEffect(() => {
    getFinal();
  }, [getFinal]);

  return;
  // <Box mt={5}>
  //   <Box>
  //     <Text mb={7}>
  //       Make sure your address and shipment method is correct before
  //       finalizing transaction!
  //     </Text>
  //     <ShoppingSummary />
  //   </Box>
  //   <Box mt={5} w={{ base: "100%", md: "70%" }}>
  //     <Button
  //       colorScheme={"pink"}
  //       textColor="black"
  //       bg={"#D54B79"}
  //       // m="auto"
  //       mb={5}
  //       borderColor="gray"
  //       fontWeight={600}
  //       onClick={onOpen}
  //     >
  //       Pembayaran
  //     </Button>
  //     <Modal isOpen={isOpen} onClose={onClose}>
  //       <ModalOverlay />
  //       <ModalContent bgGradient="linear(150.64deg, #3B0D2C 0%, rgba(74, 10, 71, 1) 16.61%, #2F0C39 61.16%, rgba(38, 8, 67, 1)  92.29%)">
  //         <ModalHeader color={"salmon"}>Pembayaran</ModalHeader>
  //         <ModalCloseButton color={"white"} />
  //         <ModalBody>
  //           <RadioGroup onChange={setPayment} value={payment}>
  //             <Box
  //               border={"2px"}
  //               borderRadius="5px"
  //               p={5}
  //               mb={3}
  //               borderColor="gray"
  //               color={"white"}
  //             >
  //               <Radio colorScheme={"pink"}>Transfer Bank</Radio>
  //             </Box>
  //             <Box
  //               border={"2px"}
  //               borderRadius="5px"
  //               p={5}
  //               borderColor="gray"
  //               color={"white"}
  //             >
  //               <Radio isDisabled>Lainnya (Coming Soon)</Radio>
  //             </Box>
  //           </RadioGroup>
  //           <Box mt={5}>
  //             <ShoppingSummary />
  //           </Box>
  //         </ModalBody>
  //         <ModalFooter>
  //           <Button textColor="black" bg={"#D54B79"}>
  //             Bayar
  //           </Button>
  //         </ModalFooter>
  //       </ModalContent>
  //     </Modal>
  //   </Box>
  // </Box>
};
