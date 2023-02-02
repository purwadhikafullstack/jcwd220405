import { useState } from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  Input,
  FormHelperText,
  Flex,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import swal from "sweetalert";

import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";

export const ProfileSettingPassword = ({ user, baseApi, toast }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleShowNewPasswordConfirm = () =>
    setShowNewPasswordConfirm(!showNewPasswordConfirm);
  const dispatch = useDispatch();

  const handlePassword = async () => {
    const once = await swal("Are you sure to change your password?", {
      dangerMode: true,
      buttons: true,
    });
    if (once) {
      onOpen();
    }
  };

  const passwordValid = Yup.object().shape({
    oldPassword: Yup.string()
      .required("Password required")
      .min(8, "Minimum password 8"),
    newPassword: Yup.string()
      .min(8, "New passwords of at least 8")
      .required("New password required")
      .matches(/(?=.*[a-z])/, "New password must contain a lowercase")
      .matches(/(?=.*[A-Z])/, "New password must contain a uppercase")
      .matches(/(?=.*[0-9])/, "New password must contain a number."),
    newPasswordConfirmation: Yup.string()
      .oneOf(
        [Yup.ref("newPassword"), null],
        "Confirmation new password does'nt match"
      )
      .required("Confirmation new password required"),
  });

  const changePassword = async (value) => {
    try {
      setLoading(true);
      await axios.patch(`${baseApi}/user/setting/password/${user.id}`, value);
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Successful Change of Password",
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
            title: "Please login again",
            status: "info",
            duration: 3500,
            isClosable: false,
          }),
        3000
      );
      setTimeout(() => {
        dispatch(logout());
        localStorage.removeItem("token");
      }, 3000);
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

  return (
    <>
      <Button
        variant={"outline"}
        _hover={{ color: "black", bg: "white" }}
        w={"80%"}
        m={"auto"}
        onClick={handlePassword}
      >
        Change Password
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Change Password</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              newPasswordConfirmation: "",
            }}
            validationSchema={passwordValid}
            onSubmit={(value) => {
              changePassword(value);
            }}
          >
            {(props) => {
              return (
                <>
                  <Form>
                    <ModalBody pb={6}>
                      <FormControl>
                        <Flex direction={"column"} gap={5}>
                          <InputGroup>
                            <Input
                              name="oldPassword"
                              as={Field}
                              placeholder="Old Password"
                              type={showPassword ? "text" : "password"}
                            />
                            <InputRightElement>
                              <IconButton onClick={handleShowPassword}>
                                {showPassword ? (
                                  <IoEyeOutline />
                                ) : (
                                  <IoEyeOffOutline />
                                )}
                              </IconButton>
                            </InputRightElement>
                          </InputGroup>
                          <ErrorMessage
                            style={{ color: "orange" }}
                            component="div"
                            name="oldPassword"
                          />
                          <InputGroup>
                            <Input
                              name="newPassword"
                              as={Field}
                              placeholder="New Password"
                              type={showNewPassword ? "text" : "password"}
                            />
                            <InputRightElement>
                              <IconButton onClick={handleShowNewPassword}>
                                {showNewPassword ? (
                                  <IoEyeOutline />
                                ) : (
                                  <IoEyeOffOutline />
                                )}
                              </IconButton>
                            </InputRightElement>
                          </InputGroup>
                          <ErrorMessage
                            style={{ color: "orange" }}
                            component="div"
                            name="newPassword"
                          />
                          <InputGroup>
                            <Input
                              name="newPasswordConfirmation"
                              as={Field}
                              placeholder="Confirmation New Password"
                              type={
                                showNewPasswordConfirm ? "text" : "password"
                              }
                            />
                            <InputRightElement>
                              <IconButton
                                onClick={handleShowNewPasswordConfirm}
                              >
                                {showNewPasswordConfirm ? (
                                  <IoEyeOutline />
                                ) : (
                                  <IoEyeOffOutline />
                                )}
                              </IconButton>
                            </InputRightElement>
                          </InputGroup>
                          <ErrorMessage
                            style={{ color: "orange" }}
                            component="div"
                            name="newPasswordConfirmation"
                          />
                          <FormHelperText>
                            Make sure your password is correct
                          </FormHelperText>
                        </Flex>
                      </FormControl>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        variant={"outline"}
                        type={"submit"}
                        isLoading={isLoading}
                      >
                        Save
                      </Button>
                    </ModalFooter>
                  </Form>
                </>
              );
            }}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
