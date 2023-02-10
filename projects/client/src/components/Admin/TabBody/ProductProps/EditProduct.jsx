// react
import Axios from "axios";
import { useRef } from "react";

// validation
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";

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

// swal
import Swal from "sweetalert2";

// icons
import { BsFillGearFill } from "react-icons/bs";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const EditProduct = ({ getProducts, category, item, warehouse }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              warehouse={warehouse}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ close, category_name, getProducts, item, warehouse }) => {
  const url = process.env.REACT_APP_API_BASE_URL + `/admin/`;
  const token = localStorage.getItem("token");

  const ProductCategoryId = useRef("");

  const validation = Yup.object().shape({
    name: Yup.string().required("Cannot be Empty"),
    desc: Yup.string()
      .min(50, "Desc minimum is 50 char")
      .required("Cannot be Empty"),
    price: Yup.number("Must be Integer").required("Cannot be Empty"),
    weight: Yup.number("Must be Integer").required("Cannot be Empty"),
  });

  const editProduct = async (value) => {
    try {
      const editData = {
        name: value.name,
        desc: value.desc,
        price: +value.price,
        weight: +value.weight,
        ProductCategoryId: +ProductCategoryId.current.value,
      };

      const updateStocks = {
        stocks: +value.stocks,
      };

      if (
        value.name !== item.name ||
        value.desc !== item.desc ||
        +value.price !== item.price ||
        +value.weight !== item.weight ||
        +ProductCategoryId.current.value !== item.Product_Category.id
      ) {
        await Axios.patch(url + `edit_product/${item.id}`, editData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }

      if (+value.stocks !== item.total_stocks) {
        await Axios.patch(
          url + `edit_stocks?ProductId=${item.id}&WarehouseId=${warehouse}`,
          updateStocks,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Product Edited`,
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
          name: item.name,
          desc: item.desc,
          price: item.price,
          weight: item.weight,
          stocks: item.total_stocks ? item.total_stocks : 0,
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          editProduct(value);
        }}
      >
        {(props) => {
          return (
            <Form>
              <FormControl>
                <FormLabel>Category Name</FormLabel>
                <Input as={Field} name={"name"} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="name"
                />
                <FormLabel>Description</FormLabel>
                <Textarea as={Field} name={"desc"} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="desc"
                />
                <FormLabel>Price</FormLabel>
                <Input as={Field} name={"price"} type={"number"} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="price"
                />
                <FormLabel>Weight</FormLabel>
                <Input as={Field} name={"weight"} type={"number"} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="weight"
                />
                {isNaN(warehouse) ? null : (
                  <>
                    <FormLabel>Stocks</FormLabel>
                    <Input type={"number"} as={Field} name={"stocks"} />
                  </>
                )}
                <FormLabel>Category</FormLabel>
                <Select
                  ref={ProductCategoryId}
                  defaultValue={item.Product_Category.id}
                >
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
