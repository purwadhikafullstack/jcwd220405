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
} from "@chakra-ui/react";

export const EditCategory = ({ category, getCategory }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button onClick={onOpen}>Edit</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditForm
              categoryValue={category}
              getCategory={getCategory}
              close={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ close, categoryValue, getCategory }) => {
  const url = `http://localhost:8000/api/admin/edit_category/${categoryValue.id}`;

  const category_name = useRef("");

  const editCategory = async () => {
    try {
      const editData = {
        category: category_name.current.value,
      };
      await Axios.patch(url, editData);
      getCategory();
      close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Category</FormLabel>
        <Input defaultValue={categoryValue.category} ref={category_name} />
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={editCategory}>
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
