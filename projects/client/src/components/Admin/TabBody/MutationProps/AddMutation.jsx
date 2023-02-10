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
  Center,
  IconButton,
  Select,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddMutation = ({ warehouses, products, warehouseId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        onClick={onOpen}
        leftIcon={<CgMathPlus />}
        bg={"#7dc67f"}
        _hover={{ bg: "#abdbad" }}
      >
        Request Mutation
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Request Mutation</ModalHeader>
          <ModalBody>
            <AddForm
              close={onClose}
              warehouses={warehouses}
              products={products}
              warehouseId={warehouseId}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close, warehouses, products, warehouseId }) => {
  const url = process.env.REACT_APP_API_BASE_URL + "/admin/add_mutation";
  const token = localStorage.getItem("token");

  const WarehouseTo = useRef("");
  const WarehouseFrom = useRef("");
  const Product = useRef("");

  const validation = Yup.object().shape({
    Quantity: Yup.number("Must be Integer").required("Cannot be Empty"),
  });

  const addMutation = async (value) => {
    try {
      const data = {
        IdWarehouseFrom: +WarehouseFrom.current.value,
        IdWarehouseTo: +WarehouseTo.current.value,
        ProductId: +Product.current.value,
        quantity: +value.Quantity,
      };

      if (data.IdWarehouseFrom === data.IdWarehouseTo) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Receiver and Sender can't be the same",
        });
      } else {
        await Axios.post(url, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Request is sent",
        });
         
        close();
      }
    } catch (err) {
      console.log(err);

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
          Quantity: "",
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          addMutation(value);
        }}
      >
        {(props) => {
          return (
            <Form>
              <FormControl isRequired>
                <FormLabel>Request Warehouse</FormLabel>
                {warehouseId === null ? (
                  <Select ref={WarehouseTo} placeholder={"- Select -"}>
                    {warehouses?.map((item, index) => {
                      return (
                        <option value={item.id} key={index}>
                          {item.warehouse_name}
                        </option>
                      );
                    })}
                  </Select>
                ) : (
                  <Select ref={WarehouseTo} disabled>
                    <option value={warehouseId.id}>
                      {warehouseId.warehouse_name}
                    </option>
                  </Select>
                )}
                <FormLabel>Response Warehouse</FormLabel>
                <Select ref={WarehouseFrom}>
                  <option>- Select -</option>
                  {warehouses?.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>
                        {item.warehouse_name}
                      </option>
                    );
                  })}
                </Select>
                <FormLabel>Product</FormLabel>
                <Select ref={Product}>
                  <option>- Select -</option>
                  {products?.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>
                        {item.id}
                      </option>
                    );
                  })}
                </Select>
                <FormLabel>Quantity</FormLabel>
                <Input as={Field} name={"Quantity"} type={"number"} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="Quantity"
                />
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
