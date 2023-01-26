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
  IconButton,
  Center,
} from "@chakra-ui/react";

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
  const url = `http://localhost:8000/api/admin/edit_user/${user.id}`;

  const email = useRef("");
  const name = useRef("");
  const role = useRef("");

  const editUser = async () => {
    try {
      if (
        email.current.value !== user.email ||
        name.current.value !== user.name ||
        +role.current.value !== user.role
      ) {
        const editData = {
          email: email.current.value,
          name: name.current.value,
          role: +role.current.value,
        };
        await Axios.patch(url, editData);
        getUsers();
      }

      close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" defaultValue={user.email} ref={email} />
        <FormLabel>Name</FormLabel>
        <Input defaultValue={user.name} ref={name} />
        <FormLabel>Role</FormLabel>
        <NumberInput defaultValue={user.role} min={1} max={3}>
          <NumberInputField ref={role} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Center paddingTop={"10px"} gap={"10px"}>
          <IconButton
            icon={<RxCheck />}
            fontSize={"3xl"}
            color={"green"}
            onClick={editUser}
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
