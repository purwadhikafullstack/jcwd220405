// react
import Axios from "axios";
import { useRef } from "react";

// chakra
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  IconButton,
  Center,
} from "@chakra-ui/react";

// icons
import { BsFillGearFill } from "react-icons/bs";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const EditProduct = ({ getProducts, category, item }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // console.log(user);

  return (
    <Box>
      <IconButton icon={<BsFillGearFill />} bg={"none"} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Edit Product</ModalHeader>
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
      if (
        name.current.value !== item.name ||
        desc.current.value !== item.desc ||
        +price.current.value !== item.price ||
        +weight.current.value !== item.weight ||
        +ProductCategoryId.current.value !== item.Product_Category.id
      ) {
        const editData = {
          name: name.current.value,
          desc: desc.current.value,
          price: +price.current.value,
          weight: +weight.current.value,
          ProductCategoryId: +ProductCategoryId.current.value,
        };
        Axios.patch(url, editData);
        getProducts();
      }

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
        <Input defaultValue={item.weight} ref={weight} type={"number"} />
        <FormLabel>Category</FormLabel>
        <Select ref={ProductCategoryId} defaultValue={item.Product_Category.id}>
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
            onClick={editProduct}
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
