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
} from "@chakra-ui/react";

export const EditModal = ({ user, setReload }) => {
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
              <EditForm user={user} setReload={setReload} close={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  const EditForm = ({ user, close, setReload }) => {
    const url = `http://localhost:8000/api/admin/edit_user/${user.id}`;
  
    const email = useRef("");
    const name = useRef("");
    const role = useRef("");
  
    const editUser = async () => {
      try {
        const editData = {
          email: email.current.value,
          name: name.current.value,
          role: parseInt(role.current.value),
        };
        Axios.patch(url, editData);
        setReload(true);
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
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={editUser}>
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