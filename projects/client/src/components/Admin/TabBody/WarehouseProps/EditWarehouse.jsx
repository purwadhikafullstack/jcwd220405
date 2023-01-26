// react
import Axios from "axios";
import { useRef } from "react";

// chakra
import {
  Box,
  Center,
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
  IconButton,
} from "@chakra-ui/react";

// icons
import { BsFillGearFill } from "react-icons/bs";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const EditWarehouse = ({ warehouse, getWarehouse, admin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <IconButton icon={<BsFillGearFill />} bg={"none"} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Edit Warehouse</ModalHeader>
          <ModalBody>
            <EditForm
              warehouse={warehouse}
              getWarehouse={getWarehouse}
              close={onClose}
              admin={admin}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ warehouse, close, getWarehouse, admin }) => {
  const url = `http://localhost:8000/api/admin/edit_warehouse/${warehouse.id}`;

  const warehouse_name = useRef("");
  const province = useRef("");
  const city = useRef("");
  const postal_code = useRef("");
  const UserId = useRef("");

  const editWarehouse = async () => {
    try {
      if (
        warehouse_name.current.value !== warehouse.warehouse_name ||
        province.current.value !== warehouse.province ||
        city.current.value !== warehouse.city ||
        +postal_code.current.value !== warehouse.postal_code ||
        +UserId.current.value !== warehouse.UserId
      ) {
        const editData = {
          warehouse_name: warehouse_name.current.value,
          province: province.current.value,
          city: city.current.value,
          postal_code: postal_code.current.value,
          UserId: UserId.current.value,
        };
        await Axios.patch(url, editData);
        getWarehouse();
      }

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
        <Select ref={UserId} defaultValue={warehouse.UserId}>
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
            onClick={editWarehouse}
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
