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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Select,
} from "@chakra-ui/react";

export const EditProduct = ({ getProducts, category, item }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // console.log(user);

  return (
    <Box>
      <Button onClick={onOpen}>Edit</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditForm
              close={onClose}
              category_name={category}
              getProducts={getProducts}
              item={item}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ close, category_name, getProducts, item }) => {
  const url = "http://localhost:8000/api/admin/add_product";

  const name = useRef("");
  const desc = useRef("");
  const price = useRef("");
  const weight = useRef("");
  const ProductCategoryId = useRef("");

  const editProduct = async () => {
    try {
      const editData = {
        name: name.current.value,
        desc: desc.current.value,
        price: +price.current.value,
        weight: +weight.current.value,
        ProductCategoryId: +ProductCategoryId.current.value,
      };
      Axios.patch(url, editData);
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
        <Input defaultValue={item.name} ref={name} />
        <FormLabel>Description</FormLabel>
        <Textarea defaultValue={item.desc} ref={desc} />
        <FormLabel>Price</FormLabel>
        <Input defaultValue={item.price} ref={price} />
        <FormLabel>Weight</FormLabel>
        <Input defaultValue={item.weight} ref={weight} />
        <FormLabel>Category</FormLabel>
        <Select ref={ProductCategoryId} defaultValue={item.Product_Category.id}>
          {console.log(item.Product_Category.category)}
          {category_name?.map((item, index) => {
            return (
              <option value={item.id} key={index}>
                {item.category}
              </option>
            );
          })}
        </Select>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={editProduct}>
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
