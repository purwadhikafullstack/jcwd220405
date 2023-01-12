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

export const EditModal = ({ warehouse, setReload, admin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button onClick={onOpen} background={"#C146ED"}>Edit</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditForm
              warehouse={warehouse}
              setReload={setReload}
              close={onClose}
              admin={admin}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ warehouse, close, setReload, admin }) => {
  const url = `http://localhost:8000/api/admin/edit_warehouse/${warehouse.id}`;

  const warehouse_name = useRef("");
  const province = useRef("");
  const city = useRef("");
  const postal_code = useRef("");
  const UserId = useRef("");

  console.log(admin);
  const editWarehouse = async () => {
    try {
      const editData = {
        warehouse_name: warehouse_name.current.value,
        province: province.current.value,
        city: city.current.value,
        postal_code: postal_code.current.value,
        UserId: UserId.current.value,
      };
      // console.log(editData);
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
        <FormLabel>Warehouse Name</FormLabel>
        <Input defaultValue={warehouse.warehouse_name} ref={warehouse_name} />
        <FormLabel>Province</FormLabel>
        <Input defaultValue={warehouse.province} ref={province} />
        <FormLabel>City</FormLabel>
        <Input defaultValue={warehouse.city} ref={city} />
        <FormLabel>Postal Code</FormLabel>
        <Input
          type={"number"}
          defaultValue={warehouse.postal_code}
          ref={postal_code}
        />
        <FormLabel>Admin Id</FormLabel>
        {/* <Input defaultValue={warehouse.UserId} ref={UserId} /> */}
        <Select ref={UserId} defaultValue={warehouse.UserId} >
          {admin.map((item, index) => {
            return (
              <option value={item.id} key={index}>
                {item.id}
              </option>
            );
          })}
        </Select>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={editWarehouse}>
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
