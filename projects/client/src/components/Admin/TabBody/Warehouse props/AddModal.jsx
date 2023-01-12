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
  Select,
} from "@chakra-ui/react";

export const AddModal = ({ setReload, admin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button onClick={onOpen}>Add</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddForm close={onClose} admin={admin} setReload={setReload} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close, setReload, admin }) => {
  const url = "http://localhost:8000/api/admin/add_warehouse";

  const warehouse_name = useRef("");
  const province = useRef("");
  const city = useRef("");
  const postal_code = useRef("");
  const UserId = useRef("");

  const addWarehouse = async () => {
    try {
      const data = {
        warehouse_name: warehouse_name.current.value,
        province: province.current.value,
        city: city.current.value,
        postal_code: postal_code.current.value,
        UserId: UserId.current.value,
      };
      // console.log(data);
      await Axios.post(url, data);
      setReload(true);
      // close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Warehouse Name</FormLabel>
        <Input ref={warehouse_name} />
        <FormLabel>Province</FormLabel>
        <Input ref={province} />
        <FormLabel>City</FormLabel>
        <Input ref={city} />
        <FormLabel>Postal Code</FormLabel>
        <Input type={"number"} ref={postal_code} />
        <FormLabel>Admin Id</FormLabel>
        <Select ref={UserId}>
          {admin.map((item, index) => {
            return (
              <option value={item.id} key={index}>
                {item.id}
              </option>
            );
          })}
        </Select>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={addWarehouse}>
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
