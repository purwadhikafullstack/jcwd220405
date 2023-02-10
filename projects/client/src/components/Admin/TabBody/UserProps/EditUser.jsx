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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Center,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BsFillGearFill } from "react-icons/bs";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const EditUser = ({ user, getUsers }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <IconButton icon={<BsFillGearFill />} bg={"none"} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Edit User</ModalHeader>
          <ModalBody>
            <EditForm user={user} getUsers={getUsers} close={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ user, close, getUsers }) => {
  const url =
    process.env.REACT_APP_API_BASE_URL + `/admin/edit_user/${user.id}`;
  const token = localStorage.getItem("token");

  const role = useRef("");

  const validation = Yup.object().shape({
    email: Yup.string().email("Email Invalid").required("Cannot be Empty"),
    name: Yup.string().required("Cannot be Empty"),
  });

  const editUser = async (value) => {
    try {
      if (
        value.email !== user.email ||
        value.name !== user.name ||
        +role.current.value.role !== user.role
      ) {
        const editData = {
          email: value.email,
          name: value.name,
          role: +role.current.value,
        };
        await Axios.patch(url, editData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        getUsers();
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `User Edited`,
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
          email: user.email,
          name: user.name,
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          editUser(value);
        }}
      >
        {(props) => {
          return (
            <Form>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input as={Field} type="email" name={"email"} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="email"
                />
                <FormLabel>Name</FormLabel>
                <Input as={Field} name={"name"} />
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="name"
                />
                <FormLabel>Role</FormLabel>
                <NumberInput min={1} max={3} defaultValue={user.role}>
                  <NumberInputField ref={role} readOnly />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="role"
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
