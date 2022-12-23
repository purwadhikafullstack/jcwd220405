import React, { useState } from "react";
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
  FormLabel,
  Input,
  Text,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
  Badge,
  Flex,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import swal from "sweetalert";

import { Link } from "react-router-dom";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

export const SettingName = ({ user, name, setName }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text as={Link} color="#D54B79" onClick={onOpen}>
        {user.name ? "Change" : "Add"}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Change Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormHelperText>
                The name is visible to other users
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              m={"auto"}
              onClick={onClose}
              disabled={name === user.name ? true : false}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const SettingBirthDate = ({ user, birthDate, setbirthDate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text as={Link} color="#D54B79" onClick={onOpen}>
        {user.birthDate ? "Change" : "Add"}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Change Date of Birth</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setbirthDate(e.target.value)}
                min={"1950-01-01"}
                max={"2010-01-01"}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              m={"auto"}
              type={"submit"}
              disabled={birthDate === user.birthDate ? true : false}
              onClick={onClose}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const SettingGender = ({ user, gender, setGender }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text as={Link} color="#D54B79" onClick={onOpen}>
        {user.gender ? "Change" : "Add"}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Add Gender</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormHelperText mb={5} textAlign={"center"}>
                Make sure the data is correct
              </FormHelperText>
              <RadioGroup
                onChange={setGender}
                value={gender}
                defaultChecked={gender}
              >
                <Stack direction="row" justifyContent={"center"} gap={5}>
                  <Radio value="Pria">Man</Radio>
                  <Radio value="Wanita">Woman</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              m={"auto"}
              type={"submit"}
              disabled={gender === user.gender ? true : false}
              onClick={onClose}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const styles = {
  dropContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: "150px",
    borderRadius: "10px",
    border: "2px dashed #555",
    color: "#444",
    cursor: "pointer",
  },
};

export const SettingEmail = ({ user, email, baseApi, toast }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);

  const handleEmail = async () => {
    const once = await swal("Are you sure?", {
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
        2000
      );
      setTimeout(() => setLoading(false), 2500);
      setTimeout(() => window.location.reload(), 4000);
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
          {user.is_verified ? "Verified" : "Unverified"}
        </Badge>
        <Text
          as={Link}
          color="#D54B79"
          hidden={user?.is_verified ? true : false}
          onClick={() => alert("Unverified")}
        >
          Now
        </Text>
        <Text
          as={Link}
          color="#D54B79"
          onClick={handleEmail}
          hidden={!user?.is_verified ? true : false}
        >
          Change
        </Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Change Email</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ email: email }}
            validationSchema={emailValid}
            onSubmit={(value) => {
              changeEmail(value);
            }}
          >
            {(props) => {
              return (
                <>
                  <Form>
                    <ModalBody pb={6}>
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
                          You have to re-verify your email
                        </FormHelperText>
                      </FormControl>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        variant={"outline"}
                        colorScheme={"#D54B79"}
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

export const SettingPhoto = ({
  user,
  handleChoose,
  handleUpload,
  image,
  setImage,
  minString,
  isLoading,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant={"outline"}
        _hover={{ color: "black", bg: "white" }}
        onClick={onOpen}
      >
        {user.picture ? "Change Photo" : "Select Photo"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay onClick={() => setImage("")} />
        <ModalContent>
          <ModalHeader m={"auto"}>Select Photo</ModalHeader>
          <ModalCloseButton onClick={() => setImage("")} />
          <ModalBody pb={6} textAlign={{ base: "center" }}>
            <form encType="multipart/form-data">
              <label
                htmlFor="image"
                className="drop-container"
                style={styles.dropContainer}
              >
                <Text>{image ? minString(image?.name, 33) : ""}</Text>
                <input
                  type="file"
                  accept=".png, .jpg, .gif"
                  name="image"
                  id="image"
                  onChange={(e) => handleChoose(e)}
                  hidden={image ? true : false}
                />
              </label>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              variant={"outline"}
              onClick={handleUpload}
              colorScheme={"#D54B79"}
              isLoading={isLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const SettingPassword = ({ user, baseApi, toast }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleShowNewPasswordConfirm = () =>
    setShowNewPasswordConfirm(!showNewPasswordConfirm);

  const handlePassword = async () => {
    const once = await swal("Are you sure?", {
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
        2000
      );
      setTimeout(() => setLoading(false), 2500);
      setTimeout(() => window.location.reload(), 4000);
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
                        colorScheme={"#D54B79"}
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
