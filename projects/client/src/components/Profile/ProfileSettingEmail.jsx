import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  FormHelperText,
  Badge,
  Flex,
  ModalFooter,
  Box,
} from "@chakra-ui/react";
import swal from "sweetalert";

import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";
import { ReVerifyButton } from "../Button/ReVerifyButton";

export const ProfileSettingEmail = ({ user, baseApi, toast }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [check, setCheck] = useState("");
  const dispatch = useDispatch();

  const checkPassword = async () => {
    try {
      setLoading(true);
      const response = await (
        await axios.post(`${baseApi}/user/check/${user.id}`, { check })
      ).data;
      setIsCheck(response.status);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        position: "top",
        title: error.response.data,
        status: "error",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleEmail = async () => {
    const once = await swal("Are you sure to change your email?", {
      dangerMode: true,
      buttons: true,
    });
    if (once) {
      onOpen();
    }
  };

  const emailValid = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email can't be empty"),
  });

  const changeEmail = async (value) => {
    try {
      setLoading(true);
      await axios.patch(`${baseApi}/user/setting/email/${user.id}`, value);
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Successfully Change Email",
            status: "success",
            isClosable: true,
          }),
        1500
      );
      setTimeout(() => setLoading(false), 2000);
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Please login again with your new Email",
            status: "info",
            duration: 3500,
            isClosable: false,
          }),
        3000
      );
      setTimeout(() => {
        dispatch(logout());
        localStorage.removeItem("token");
      }, 2500);
    } catch (error) {
      console.error(error);
      toast({
        position: "top",
        title: error.response.data,
        status: "error",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Flex
        gap={{ base: "2", md: "4" }}
        direction={{ base: "column", md: "row" }}
        textAlign={"center"}
      >
        <Badge color="#D54B79" alignSelf={"center"} variant={"outline"}>
          {user?.is_verified ? "Verified" : "Unverified"}
        </Badge>
        <ReVerifyButton user={user} baseApi={baseApi} toast={toast} />
        <Text
          as={Link}
          color="#D54B79"
          onClick={handleEmail}
          hidden={!user?.is_verified ? true : false}
        >
          Change
        </Text>
      </Flex>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Change Email</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setCheck("");
              setIsCheck(false);
            }}
          />
          <Formik
            initialValues={{ email: "" }}
            validationSchema={emailValid}
            onSubmit={(value) => {
              changeEmail(value);
            }}
          >
            {(props) => {
              return (
                <>
                  <Form>
                    <Box pb={6} hidden={isCheck ? false : true}>
                      <ModalBody>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            name="email"
                            as={Field}
                            placeholder="Email"
                            type="text"
                            autoComplete="off"
                          />
                          <ErrorMessage
                            style={{ color: "orange" }}
                            component="div"
                            name="email"
                          />
                          <FormHelperText>
                            You have to re-login and re-verify your email
                          </FormHelperText>
                        </FormControl>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          variant={"outline"}
                          type={"submit"}
                          isLoading={isLoading}
                        >
                          Send
                        </Button>
                      </ModalFooter>
                    </Box>
                  </Form>
                </>
              );
            }}
          </Formik>
          <Box hidden={isCheck ? true : false} mb={"4"}>
            <ModalBody>
              <FormControl>
                <FormLabel>Please enter your Password</FormLabel>
                <Input
                  placeholder="Enter your Password"
                  type="password"
                  onChange={(e) => setCheck(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      checkPassword();
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                variant={"outline"}
                onClick={() => checkPassword()}
                isDisabled={check ? false : true}
                isLoading={isLoading}
              >
                Send
              </Button>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
