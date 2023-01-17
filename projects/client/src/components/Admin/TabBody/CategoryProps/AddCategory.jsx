// react
import Axios from "axios";
import { useRef } from "react";

// chakra
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

export const AddCategory = ({ getCategory }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button onClick={onOpen}>Add</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddForm close={onClose} getCategory={getCategory} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close, getCategory }) => {
  const url = "http://localhost:8000/api/admin/add_category";

  const category = useRef("");

  const addCategory = async () => {
    try {
      const data = {
        category: category.current.value,
      };
      // console.log(data);
      await Axios.post(url, data);
      getCategory();
      close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Category Name</FormLabel>
        <Input ref={category} />
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={addCategory}>
            Submit
          </Button>
          <Button colorScheme="blue" mr={3} onClick={close}>
            Close
          </Button>
        </ModalFooter>
      </FormControl>
    </Box>
  );
};
