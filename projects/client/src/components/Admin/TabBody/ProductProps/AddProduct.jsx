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

export const AddProduct = ({ getProducts, category, warehouses }) => {
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
              warehouses={warehouses}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close, category_name, getProducts, warehouses }) => {
  const url = process.env.REACT_APP_API_BASE_URL + "/admin/";

  const name = useRef("");
  const desc = useRef("");
  const price = useRef("");
  const weight = useRef("");
  const ProductCategoryId = useRef("");

  // console.log(warehouses);

  const addProduct = async () => {
    try {
      const data = {
        name: name.current.value,
        desc: desc.current.value,
        price: +price.current.value,
        weight: +weight.current.value,
        ProductCategoryId: +ProductCategoryId.current.value,
      };
      const result = await Axios.post(url + "add_product", data);

      await warehouses.map(async(warehouse) => {
        const stocks = {
          stocks: 0,
          ProductId: result.data.id,
          WarehouseId: warehouse.id,
        };

        return await Axios.post(url + `add_stocks`, stocks);
      });

      getProducts();
      close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Product Name</FormLabel>
        <Input ref={name} />
        <FormLabel>Description</FormLabel>
        <Textarea ref={desc} />
        <FormLabel>Price</FormLabel>
        <Input type={"number"} ref={price} />
        <FormLabel>Weight</FormLabel>
        <Input type={"number"} ref={weight} />
        <FormLabel>Category</FormLabel>
        <Select ref={ProductCategoryId}>
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
