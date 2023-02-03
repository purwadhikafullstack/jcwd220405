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
  Text,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";
import axios from "axios";

export const DeleteAddress = ({ item, getAddressUser, baseApi, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const deleteAddress = async (item) => {
    try {
      setLoading(true);
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
      setTimeout(() => getAddressUser(), 3000);
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
