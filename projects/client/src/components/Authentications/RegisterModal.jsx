import React from "react";
import {
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
  Center,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import * as Yup from "yup";
import { Field, ErrorMessage, Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";

const url = process.env.REACT_APP_API_BASE_URL;

export const RegisterModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email().required(),
  });

  const onRegister = async (data) => {
    try {
      setIsLoading(true);
      const result = await axios.post(`${url}/user/register`, data);
      console.log(result);

      Swal.fire({
        icon: "success",
        title: "Email Sent",
        text: `${result.data.message}`,

        customClass: {
          container: "my-swal",
        },
      });
      setIsLoading(false);
      onClose();
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.name
          ? err.response.data.errors[0].message
          : err.response.data,

        customClass: {
          container: "my-swal",
        },
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button

        display={{ base: "solid", md: "inline-flex" }}

        fontSize={"sm"}
        fontWeight={600}
        color={"white"}
        bg={"pink.400"}
        href={"#"}
        _hover={{
          bg: "pink.300",
        }}
        onClick={onOpen}
      >
        Sign Up
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>Sign Up Here</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={(value, action) => {
                onRegister(value);
              }}
            >
              {(props) => {
                return (
                  <>
                    <Form>
                      <VStack>
                        <FormControl>
                          <FormLabel mb={10}>
                            We will send verification form through your email
                          </FormLabel>
                          <Field
                            placeholder="Enter your email"
                            as={Input}
                            type="email"
                            name="email"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </FormControl>
                        <ModalFooter>
                          <Button
                            type="submit"
                            isLoading={isLoading}
                            loadingText="Sending"
                            mr={5}
                          >
                            Send
                          </Button>
                          <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                      </VStack>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
