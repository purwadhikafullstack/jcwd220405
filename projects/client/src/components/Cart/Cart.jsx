import React, { useState, useEffect } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { cartUser } from "../../redux/cartSlice";

import { Box, Container, Heading, Divider, useToast } from "@chakra-ui/react";
import swal from "sweetalert";

import { CartCard } from "./CartCard";
import { CartSummary } from "./CartSummary";

export const Cart = ({ baseServer, baseApi }) => {
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [selectedCart, setSelectedCart] = useState(0);
  const [totalPriceCart, setTotalPriceCart] = useState(0);
  const { id } = useSelector((state) => state.userSlice.value);
  const dispatch = useDispatch();
  const toast = useToast();

  const getCart = async () => {
    try {
      const response = await (await axios.get(`${baseApi}/cart/${id}`)).data;
      setCart(response.result);
      dispatch(cartUser(response.result));
      const qty = response.result.map((item) => item.quantity);
      setQuantity(qty);
      const selectedItem = response.result
        .filter((item) => item.status === true)
        .map((item) => item.quantity)
        .reduce((a, b) => a + b, 0);
      const totalPrice = response.result
        .filter((item) => item.status === true)
        .map((item) => item.price * item.quantity)
        .reduce((a, b) => a + b, 0);
      setSelectedCart(selectedItem);
      setTotalPriceCart(totalPrice);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCart = async (item) => {
    try {
      const once = await swal("Are you sure?", {
        dangerMode: true,
        buttons: true,
      });
      if (once) {
        await axios.post(`${baseApi}/cart/d/${id}`, { IdCart: item.id });
        setTimeout(
          () =>
            toast({
              position: "top",
              title: "Successfully Delete Cart",
              status: "success",
              isClosable: true,
            }),
          1000
        );
        return setTimeout(() => getCart(), 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateCart = async (item, action, qty) => {
    try {
      await axios.patch(`${baseApi}/cart/${id}`, {
        IdCart: item.id,
        action: action,
        qty: qty,
      });
      getCart();
    } catch (error) {
      console.error(error);
    }
  };

  const selectCart = async (item) => {
    try {
      await axios.post(`${baseApi}/cart/s/${id}`, {
        IdCart: item.id,
        type: item.status ? "unchecked" : "checked",
      });
      getCart();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCart();
  }, [id]);

  return (
    <>
      <Container
        maxWidth={"80%"}
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box width={{ base: "100%", md: "70%" }} p={2}>
          <Box display={"flex"} flexDirection={"column"} gap={"4"}>
            <Heading>Cart</Heading>
          </Box>
          <CartCard
            cart={cart}
            selectCart={selectCart}
            baseServer={baseServer}
            deleteCart={deleteCart}
            updateCart={updateCart}
            quantity={quantity}
            setQuantity={setQuantity}
          />
          <Box>
            <Divider mt={"4"} borderTop={"4px"} borderBottom={"2px"} />
          </Box>
        </Box>
        <Box
          width={{ base: "90%", md: "30%" }}
          p={4}
          margin={{ base: "auto", md: "0" }}
        >
          <Box
            borderColor="rgb(213, 75, 121)"
            borderRadius="md"
            borderWidth="2px"
            p={3}
            display={"flex"}
            flexDirection={"column"}
            gap={4}
          >
            <CartSummary
              selectedCart={selectedCart}
              totalPriceCart={totalPriceCart}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
};
