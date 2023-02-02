import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Divider,
  FormHelperText,
  Checkbox,
  Text,
  Flex,
  Select,
  InputGroup,
  Textarea,
  useToast,
  Box,
} from "@chakra-ui/react";
import swal from "sweetalert";

import { useState } from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const geoapifyKey = process.env.REACT_APP_GEOAPIFY_KEY;

export const DeleteAddress = ({ item, getAddressUser, baseApi, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const deleteAddress = async (item) => {
    try {
      setLoading(true);
      // masih nembak lewat params, niatnya ambil user dari redux
      await axios.post(`${baseApi}/address/d/${id}`, { id: item.id });
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Successfully Delete Address",
            status: "success",
            isClosable: true,
          }),
        2000
      );
      setTimeout(() => setLoading(false), 2500);
      setTimeout(() => onClose(), 2500);
      setTimeout(() => getAddressUser(), 3500);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      <Text
        cursor={"pointer"}
        hidden={item.status ? true : false}
        onClick={onOpen}
      >
        Delete
      </Text>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Delete Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={"center"}>Are you sure?</ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              bgColor="rgba(204,51,0,1)"
              color={"white"}
              _hover={{ bgColor: "rgba(200,50,10,.88)" }}
              onClick={() => deleteAddress(item)}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
