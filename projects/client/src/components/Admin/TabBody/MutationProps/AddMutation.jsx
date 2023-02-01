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
  Center,
  IconButton,
  Select,
} from "@chakra-ui/react";

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

  const WarehouseTo = useRef("");
  const WarehouseFrom = useRef("");
  const Product = useRef("");
  const Quantity = useRef("");

  const addMutation = async () => {
    try {
      const data = {
        IdWarehouseFrom: WarehouseFrom.current.value,
        IdWarehouseTo: WarehouseTo.current.value,
        ProductId: Product.current.value,
        quantity: Quantity.current.value,
      };

      if (data.IdWarehouseFrom === data.IdWarehouseTo) {
        alert("Receiver and Sender can't be the same");
      } else {
        await Axios.post(url, data);
        alert("Request is sent");
        close();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Warehouse Receiver</FormLabel>
        {warehouseId === null ? (
          <Select ref={WarehouseTo}>
            <option>- Select -</option>
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
            <option value={warehouseId.id}>{warehouseId.warehouse_name}</option>
          </Select>
        )}
        <FormLabel>Warehouse Sender</FormLabel>
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
        <Input ref={Quantity} type={"number"} />
        <Center paddingTop={"10px"} gap={"10px"}>
          <IconButton
            icon={<RxCheck />}
            fontSize={"3xl"}
            color={"green"}
            onClick={addMutation}
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
