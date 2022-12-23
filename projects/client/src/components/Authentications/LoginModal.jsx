import React from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";
import Axios from "axios";
import Swal from "sweetalert2";

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
} from "@chakra-ui/react";
const url = process.env.REACT_APP_API_BASE_URL;

export const LoginModal = () => {
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();

  const dispatch = useDispatch();

  const inputEmail = useRef("");
  const inputPass = useRef("");

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const user = {
        email: inputEmail.current.value,
        password: inputPass.current.value,
      };

      const result = await Axios.post(`${url}/user/login`, user);
      dispatch(
        login({
          id: result.data.isUserExist.id,
          email: result.data.isUserExist.email,
          name: result.data.isUserExist.name,
        })
      );

      localStorage.setItem("token", result.data.token);

      Swal.fire({
        icon: "success",
        title: "Login Success",
        text: `${result.data.message}`,

        customClass: {
          container: "my-swal",
        },
      });

      onCloseLogin();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed Attempt",
        text: err.response.data.name
          ? err.response.data.errors[0].message
          : err.response.data,

        customClass: {
          container: "my-swal",
        },
      });
    }
  };

  return (
    <Box>
      <Button
        display={{ base: "block", md: "inline-flex" }}
        as={"a"}
        fontSize={"sm"}
        fontWeight={600}
        // variant={"link"}
        href={"#"}
        bg="#440F5D"
        color={"pink.300"}
        onClick={onOpenLogin}
        textAlign={"center"}
        pt={{ base: "3", md: 0 }}
      >
        Sign In
      </Button>
      <Modal isOpen={isOpenLogin} onClose={onCloseLogin}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign In to your Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <form onSubmit={onLogin}>
              <FormControl>
                <FormLabel mb={4}>Email</FormLabel>
                <Input
                  id="email"
                  placeholder="Enter your Email"
                  type="email"
                  ref={inputEmail}
                />
                <FormLabel mt={5}>Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                  ref={inputPass}
                />
              </FormControl>
              <ModalFooter>
                <Button mr={5} type="submit">
                  Login
                </Button>
                <Button onClick={onCloseLogin}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
