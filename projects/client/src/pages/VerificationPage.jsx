import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  InputRightElement,
  InputGroup,
  IconButton,
} from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import witcher from "../assets/witcher.jpg";
import Axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Field, ErrorMessage, Formik, Form } from "formik";

const url = process.env.REACT_APP_API_BASE_URL;

export const VerificationPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  // console.log(params.token);
  // console.log(user);

  const VerifyToken = async () => {
    try {
      const result = await Axios.get(`${url}/user/verification`, {
        headers: {
          Authorization: `Bearer ${params.token}`,
        },
      });
      console.log(result.data);
      setUser(result.data.user);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
        customClass: {
          container: "my-swal",
        },
      });
    }
  };

  const signUpSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(
        8,
        "password must contain 8 or more characters with at least one of each: uppercase, lowercase, number"
      )
      .matches(/(?=.*[a-z])/, "Password must contain a lowercase")
      .matches(/(?=.*[A-Z])/, "Password must contain a uppercase")
      .matches(/(?=.*[0-9])/, "Password must contain a number."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords does'nt match")
      .required("Please match with password"),
    userName: Yup.string()
      .required("User Name is required")
      .min(4, "must contain at least 4 character")
      .max(20, "maximum 20 character"),

  });

  const OnSignUp = async (data) => {
    try {
      console.log(data);

      if (data.password !== data.confirmPassword) {
        return Swal.fire({
          icon: "error",
          title: "Oooops ...",
          text: "make sure password and confirm password match",
          // timer: 2000,
          customClass: {
            container: "my-swal",
          },
        });
      }
      Swal.fire({
        icon: "success",
        title: "Account Verified",
        text: "You can now log in to your account, Happy shopping!",
        customClass: {
          container: "my-swal",
        },
      });

      const result = await Axios.post(`${url}/user/setpass`, {
        email: user,
        password: data.password,
        confirmPassword: data.confirmPassword,
        userName: data.userName,

      });
      console.log(result);
      navigate("/");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
        customClass: {
          container: "my-swal",
        },
      });
    }
  };

  const handlePassword = () => {
    setShow(!show);
  };
  const handleConfirmPassword = () => {
    setConfirm(!showConfirm);
  };

  useEffect(() => {
    VerifyToken();
  });

  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
      bg="#440F5D"
      color="white"
      bgGradient="linear(to-br, #3B0D2C, #260843)"
    >
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Formik
          initialValues={{
            email: user,
            password: "",
            confirmPassword: "",
            userName: "",

          }}
          validationSchema={signUpSchema}
          onSubmit={(value, action) => {
            OnSignUp(value);
          }}
        >
          {(props) => {
            // console.log(props);
            return (
              <Form>
                <Stack spacing={4} w={"full"} maxW={"md"}>
                  <Heading fontSize={"2xl"} pb={5}>
                    Verify and Create your Password
                  </Heading>

                  <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Field
                      as={Input}
                      type="email"
                      value={user}
                      disabled={user ? true : false}
                    />
                  </FormControl>
                  <FormControl id="userName">
                    <FormLabel>Username</FormLabel>
                    <Field as={Input} type="text" name="userName" />
                    <ErrorMessage
                      name="userName"
                      component="div"
                      style={{ color: "#D0BDAC" }}
                    />
                  </FormControl>

                  <FormControl id="password" colorScheme={"white"}>
                    <FormLabel> Create Password</FormLabel>
                    <InputGroup size="md">
                      <Field
                        as={Input}
                        type={show ? "text" : "password"}
                        name="password"
                      />
                      <InputRightElement>
                        <IconButton
                          color="black"
                          aria-label="Show Pasword"
                          onClick={handlePassword}
                        >
                          {show ? <ViewIcon /> : <ViewOffIcon />}
                        </IconButton>
                      </InputRightElement>
                    </InputGroup>
                    <ErrorMessage
                      name="password"
                      component="div"
                      style={{ color: "#D0BDAC" }}
                    />
                  </FormControl>
                  <FormControl id="confirm password">
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup size="md">
                      <Field
                        as={Input}
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                      />
                      <InputRightElement>
                        <IconButton
                          color="black"
                          aria-label="Show Pasword"
                          onClick={handleConfirmPassword}
                        >
                          {showConfirm ? <ViewIcon /> : <ViewOffIcon />}
                        </IconButton>
                      </InputRightElement>
                    </InputGroup>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      style={{ color: "#D0BDAC" }}
                    />
                  </FormControl>
                  <Stack spacing={6}>
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"start"}
                      justify={"space-between"}
                    ></Stack>
                    <Button bgColor="#C146ED" variant={"solid"} type="submit">
                      Continue
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </Flex>
      <Flex flex={2}>
        <Image
          alt={"Login Image"}
          bgSize="cover"
          //   objectFit={"cover"}
          src={witcher}
        />
      </Flex>
    </Stack>
  );
};
