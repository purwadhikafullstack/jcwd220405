import React from "react";
import { CgShoppingCart } from "react-icons/cg";
import { useSelector } from "react-redux";
import { Badge, Box, IconButton, useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

export const CartButton = () => {
  const toast = useToast();
  const { name } = useSelector((state) => state.userSlice.value);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cartSlice.value);
  const location = useLocation();

  const onClickCart = () => {
    if (name) {
      return navigate("/cart");
    } else {
      toast({
        title: "Failed Attempt",
        description: "Please sign in",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box color={"white"} position={"relative"}>
      <IconButton
        color="#D54B79"
        variant="ghost"
        icon={<CgShoppingCart />}
        onClick={() => onClickCart()}
        width={70}
        height={30}
        borderRadius={0}
        borderRight={"1px solid white"}
        fontSize={"35px"}
        _hover={{
          bg: "none",
          color: "#C146ED",
        }}
        _active={{ color: "white" }}
        disabled={location.pathname === "/cart" ? true : false}
      ></IconButton>
      <Badge
        position={"absolute"}
        right={"3"}
        top={"-.3em"}
        borderRadius={"45%"}
        backgroundColor={"#D0BDAC"}
        color={"#D54B79"}
        userSelect={"none"}
        hidden={name && cart?.length ? false : true}
      >
        {cart?.length}
      </Badge>
    </Box>
  );
};
