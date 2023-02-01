// react
import Axios from "axios";
import { useRef } from "react";

// chakra
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Center,
} from "@chakra-ui/react";

// icons
import { BsFillGearFill } from "react-icons/bs";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const EditCategory = ({ category, getCategory }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <IconButton icon={<BsFillGearFill />} bg={"none"} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditForm
              categoryValue={category}
              getCategory={getCategory}
              close={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ close, categoryValue, getCategory }) => {
  const url = `http://localhost:8000/api/admin/edit_category/${categoryValue.id}`;

  const category_name = useRef("");

  const editCategory = async () => {
    try {
      if (category_name.current.value !== categoryValue.category) {
        const editData = {
          category: category_name.current.value,
        };
        await Axios.patch(url, editData);
        getCategory();
      }

      close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Category</FormLabel>
        <Input defaultValue={categoryValue.category} ref={category_name} />
        <Center paddingTop={"10px"} gap={"10px"}>
          <IconButton
            icon={<RxCheck />}
            fontSize={"3xl"}
            color={"green"}
            onClick={editCategory}
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
