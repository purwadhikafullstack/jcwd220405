// react
import Axios from "axios";

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
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddCategory = ({ getCategory }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        onClick={onOpen}
        leftIcon={<CgMathPlus />}
        bg={"#7dc67f"}
        _hover={{ bg: "#abdbad" }}
      >
        New Category
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Add Product</ModalHeader>
          <ModalBody>
            <AddForm close={onClose} getCategory={getCategory} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close, getCategory }) => {
  const url = process.env.REACT_APP_API_BASE_URL + "/admin/add_category";
  const token = localStorage.getItem("token");

  const validation = Yup.object().shape({
    category: Yup.string().required("Cannot Be Empty"),
  });

  const addCategory = async (value) => {
    try {
      const data = {
        category: value.category,
      };

      await Axios.post(url, data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      getCategory();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Category Added`,
      });

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
          category: "",
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          addCategory(value);
        }}
      >
        {(props) => {
          return (
            <Form>
              <FormControl isRequired>
                <FormLabel>Category Name</FormLabel>
                <Input as={Field} name={"category"} placeholder={"Mouse"} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="category"
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
