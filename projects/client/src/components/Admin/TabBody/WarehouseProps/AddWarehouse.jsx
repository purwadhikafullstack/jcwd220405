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
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Center,
  IconButton,
} from "@chakra-ui/react";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddWarehouse = ({ getWarehouse, admin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        onClick={onOpen}
        leftIcon={<CgMathPlus />}
        bg={"#7dc67f"}
        _hover={{ bg: "#abdbad" }}
      >
        New Warehouse
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Add Warehouse</ModalHeader>
          <ModalBody>
            <AddForm
              close={onClose}
              admin={admin}
              getWarehouse={getWarehouse}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close, getWarehouse, admin }) => {
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
      getWarehouse();
      close();
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
        <Center paddingTop={"10px"} gap={"10px"}>
          <IconButton
            icon={<RxCheck />}
            fontSize={"3xl"}
            color={"green"}
            onClick={addWarehouse}
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
