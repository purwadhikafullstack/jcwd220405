// react
import Axios from "axios";
import { useRef } from "react";

// validation
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";

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

// swal
import Swal from "sweetalert2";

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
  const token = localStorage.getItem("token");

  const ProductCategoryId = useRef("");

  const validation = Yup.object().shape({
    name: Yup.string().required("Cannot be Empty"),
    desc: Yup.string()
      .min(50, "Desc minimum is 50 char")
      .max(200, "Desc maximum is 200 char")
      .required("Cannot be Empty"),
    price: Yup.number("Must be Integer").required("Cannot be Empty"),
    weight: Yup.number("Must be Integer").required("Cannot be Empty"),
  });

  const addProduct = async (value) => {
    try {
      const data = {
        name: value.name,
        desc: value.desc,
        price: +value.price,
        weight: +value.weight,
        ProductCategoryId: +ProductCategoryId.current.value,
      };
      const result = await Axios.post(url + "add_product", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      await warehouses.map(async (warehouse) => {
        const stocks = {
          stocks: 0,
          ProductId: result.data.id,
          WarehouseId: warehouse.id,
        };

        return await Axios.post(url + `add_stocks`, stocks, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product added",
      });

      getProducts();
      close();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.name
          ? err.response.data.errors[0].message.toUpperCase()
          : err.response.data.toUpperCase(),
      });
    }
  };

  return (
    <Box>
      <Formik
        initialValues={{
          name: "",
          desc: "",
          price: "",
          weight: "",
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          addProduct(value);
        }}
      >
        {(props) => {
          return (
            <Form>
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input name={"name"} as={Field} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="name"
                />
                <FormLabel>Description</FormLabel>
                <Textarea name={"desc"} as={Field} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="desc"
                />
                <FormLabel>Price</FormLabel>
                <Input type={"number"} name={"price"} as={Field} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="price"
                />
                <FormLabel>Weight</FormLabel>
                <Input type={"number"} name={"weight"} as={Field} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="weight"
                />
                <FormLabel>Category</FormLabel>
                <Select ref={ProductCategoryId} placeholder={"- Select -"}>
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
                    type={"submit"}
                  />
                  <IconButton
                    icon={<RxCross1 />}
                    fontSize={"xl"}
                    color={"red"}
                    onClick={close}
                  />
                </Center>
              </FormControl>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
