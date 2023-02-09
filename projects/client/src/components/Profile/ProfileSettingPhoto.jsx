import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
} from "@chakra-ui/react";

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

export const ProfileSettingPhoto = ({
  user,
  handleChoose,
  handleUpload,
  image,
  setImage,
  minString,
  isLoading,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant={"outline"}
        _hover={{ color: "black", bg: "white" }}
        onClick={onOpen}
      >
        {user?.picture ? "Change Photo" : "Select Photo"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay onClick={() => setImage("")} />
        <ModalContent>
          <ModalHeader m={"auto"}>Select Photo</ModalHeader>
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
            <Button
              variant={"outline"}
              onClick={handleUpload}
              isLoading={isLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
