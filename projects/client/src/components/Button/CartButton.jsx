import React from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";
import Axios from "axios";
import Swal from "sweetalert2";
import { CgShoppingCart, CgHeart } from "react-icons/cg";
import { useSelector } from "react-redux";
import { LoginModal } from "../Authentications/LoginModal";
import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Link,
  IconButton,
  useToast,
} from "@chakra-ui/react";
const url = process.env.REACT_APP_API_BASE_URL;

export const CartButton = () => {
  const toast = useToast();
  const { name } = useSelector((state) => state.userSlice.value);

  const onClickCart = () => {
    if (name) {
      return console.log("test");
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
    ></IconButton>
  );
};
