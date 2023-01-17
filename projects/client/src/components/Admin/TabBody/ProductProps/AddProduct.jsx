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
  Textarea,
} from "@chakra-ui/react";

export const AddProduct = ({ getProducts, category }) => {
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
            <AddForm
              close={onClose}
              category_name={category}
              getProducts={getProducts}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close, category_name, getProducts }) => {
  const url = "http://localhost:8000/api/admin/add_product";

  const name = useRef("");
  const desc = useRef("");
  const price = useRef("");
  const weight = useRef("");
  const ProductCategoryId = useRef("");

  const addProduct = async () => {
    try {
      const data = {
        name: name.current.value,
        desc: desc.current.value,
        price: +price.current.value,
        weight: +weight.current.value,
        ProductCategoryId: +ProductCategoryId.current.value,
      };
      // console.log(data);
      await Axios.post(url, data);
      getProducts();
      close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Category Name</FormLabel>
        <Input ref={name} />
        <FormLabel>Description</FormLabel>
        <Textarea ref={desc} />
        <FormLabel>Price</FormLabel>
        <Input ref={price} />
        <FormLabel>Weight</FormLabel>
        <Input ref={weight} />
        <FormLabel>Category</FormLabel>
        <Select ref={ProductCategoryId}>
          {/* <option value={null}>- SELECT -</option> */}
          {category_name?.map((item, index) => {
            return (
              <option value={item.id} key={index}>
                {item.category}
              </option>
            );
          })}
        </Select>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={addProduct}>
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
