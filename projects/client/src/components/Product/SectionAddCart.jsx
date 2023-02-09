import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartUser } from "../../redux/cartSlice";

import {
  Box,
  Button,
  Card,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export const SectionAddCart = ({
  totalStock,
  quantity,
  setQuantity,
  subtotal,
  product,
  baseApi,
  baseServer,
  imageProduct,
}) => {
  const { id, is_verified } = useSelector((state) => state.userSlice.value);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(1);

  const AddCart = async (product) => {
    try {
      if (!id) {
        return toast({
          title: `Register/Login First`,
          status: "info",
          position: "top",
          isClosable: true,
        });
      }

      if (!is_verified) {
        toast({
          title: `Verified your email`,
          status: "info",
          position: "top",
          isClosable: true,
        });
        return setTimeout(navigate("/profile/settings"), 1500);
      }

      if (!totalStock) {
        return toast({
          title: `Out of Stock`,
          status: "error",
          position: "top",
          isClosable: true,
        });
      }
      if (limit > 2) {
        return navigate("/cart");
      }

      await axios.post(`${baseApi}/cart/${id}`, {
        quantity: quantity,
        price: product.price,
        IdProduct: product.id,
        totalStock,
      });

      const cart = await (await axios.get(`${baseApi}/cart/${id}`)).data;
      dispatch(cartUser(cart.result));

      toast({
        title: `Successfully Added`,
        status: "success",
        position: "top",
        isClosable: true,
      });

      return onOpen();
    } catch (error) {
      console.error(error);
      return toast({
        title: `${error.response.data}`,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        borderColor="rgb(213, 75, 121)"
        borderRadius="md"
        borderWidth="2px"
        p={3}
      >
        <Text>Set the quantity</Text>
        <Divider my={"3"} />
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Box width={"45%"}>
            <NumberInput
              size={"md"}
              defaultValue={quantity}
              min={1}
              max={totalStock}
              borderColor={"gray"}
              isDisabled={totalStock ? false : true}
            >
              <NumberInputField
                accept="num"
                onChange={(e) => {
                  const regex = /^\d+$/;
                  if (!regex.test(e.target.value)) {
                    return setQuantity(0);
                  }
                  if (e.target.value < 1) {
                    return setQuantity(1);
                  }
                  if (e.target.value > totalStock) {
                    return setQuantity(totalStock);
                  }
                  setQuantity(+e.target.value);
                }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper
                  bg="rgb(213, 75, 121)"
                  children="+"
                  onClick={() => {
                    if (quantity < totalStock) setQuantity(quantity + 1);
                  }}
                />
                <NumberDecrementStepper
                  bg="rgb(213, 75, 121)"
                  children="-"
                  onClick={() => {
                    if (quantity > 1) setQuantity(quantity - 1);
                  }}
                />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Text>
            Stock:{" "}
            <Text as={"span"} fontWeight="bold" color={"rgb(213, 75, 121)"}>
              {totalStock}
            </Text>
          </Text>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} mb={"4"}>
          <Text color={"gray"}>Subtotal</Text>
          <Text fontWeight="bold" color={"rgb(213, 75, 121)"}>
            {totalStock ? `Rp${(subtotal * quantity)?.toLocaleString()}` : "-"}
          </Text>
        </Box>
        <Box>
          <Tooltip label={totalStock ? "" : "Out of Stock"}>
            <Button
              w={"100%"}
              colorScheme={"pink"}
              onClick={() => {
                AddCart(product);
                setLimit(limit + 1);
              }}
              disabled={totalStock ? false : true}
            >
              + Cart
            </Button>
          </Tooltip>
          <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader m={"auto"}>Successfully Added</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Card
                  direction={{ base: "column", sm: "row" }}
                  overflow="hidden"
                  variant="outline"
                  mb={"8"}
                  p={"4"}
                >
                  <Box display={"flex"} alignItems={"center"} gap={"6"}>
                    <Box
                      display={"flex"}
                      gap={"4"}
                      alignItems={"center"}
                      maxW={"80%"}
                    >
                      <Box w={"165px"} h={"130px"}>
                        <Image
                          borderRadius={"xl"}
                          width="full"
                          height="full"
                          src={
                            imageProduct
                              ? `${baseServer}${imageProduct[0]?.image}`
                              : ""
                          }
                          alt="Product"
                        />
                      </Box>
                      <Box>
                        <Text>{product?.name}</Text>
                      </Box>
                    </Box>
                    <Box maxW={"20%"}>
                      <Button
                        colorScheme="pink"
                        onClick={() => navigate("/cart")}
                      >
                        See Cart
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </>
  );
};
