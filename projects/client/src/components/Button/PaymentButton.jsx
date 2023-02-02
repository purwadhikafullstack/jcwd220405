import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  useToast,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Axios from "axios";
const baseApi = process.env.REACT_APP_API_BASE_URL;

export const PaymentProof = ({ id }) => {
  //   console.log(id);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState("");
  const styles = {
    dropContainer: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      height: "150px",
      borderRadius: "10px",
      border: "2px dashed #555",
      color: "#444",
      cursor: "pointer",
    },
  };
  const minString = (str, num) => {
    if (str?.length > num) return str.slice(0, num) + "...";
    return str;
  };

  const handleChoose = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    console.log(image);
    try {
      if (image?.size > 1028576) {
        return toast({
          position: "top",
          title: "File size too large. Maximum 1MB",
          status: "warning",
          isClosable: true,
        });
      }

      if (!image) {
        return toast({
          position: "top",
          title: "Select file",
          status: "warning",
          isClosable: true,
        });
      }

      const data = new FormData();
      data.append("image", image);

      await Axios.post(`${baseApi}/uploadpayment/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTimeout(() => window.location.reload(), 4000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Button onClick={onOpen} bg="#D54B79">
        Upload your payment receipt
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay onClick={() => setImage("")} />
        <ModalContent>
          <ModalHeader>Upload your payment receipt</ModalHeader>
          <ModalCloseButton onClick={() => setImage("")} />
          <ModalBody pb={6} textAlign={{ base: "center" }}>
            <form encType="multipart/form-data">
              <label
                htmlFor="image"
                className="drop-container"
                style={styles.dropContainer}
              >
                <Text>{image ? minString(image?.name, 33) : ""}</Text>
                <input
                  type="file"
                  accept=".png, .jpg, .gif"
                  name="image"
                  id="image"
                  onChange={(e) => handleChoose(e)}
                  hidden={image ? true : false}
                />
              </label>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleUpload}>Upload</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
