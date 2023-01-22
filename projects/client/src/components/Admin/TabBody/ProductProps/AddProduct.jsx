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
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Center,
  IconButton,
} from "@chakra-ui/react";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddProduct = ({ getProducts, category }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        onClick={onOpen}
        leftIcon={<CgMathPlus />}
        bg={"#7dc67f"}
        _hover={{ bg: "#abdbad" }}
      >
        New Product
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Add Product</ModalHeader>
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
        <Center paddingTop={"10px"} gap={"10px"}>
          <IconButton
            icon={<RxCheck />}
            fontSize={"3xl"}
            color={"green"}
            onClick={addProduct}
          />
          <IconButton
            icon={<RxCross1 />}
            fontSize={"xl"}
            color={"red"}
            onClick={close}
          />
        </Center>
      </FormControl>
    </Box>
  );
};
