import { Link } from "react-router-dom";

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
  FormControl,
  FormLabel,
  Input,
  Text,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";

export const ProfileSettingName = ({ user, name, setName }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text as={Link} color="#D54B79" onClick={onOpen}>
        {user?.name ? "Change" : "Add"}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Change Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormHelperText>
                The name is visible to other users
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              m={"auto"}
              onClick={onClose}
              disabled={name === user?.name || !name ? true : false}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const ProfileSettingBirthDate = ({ user, birthDate, setbirthDate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text as={Link} color="#D54B79" onClick={onOpen}>
        {user?.birthDate ? "Change" : "Add"}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Change Date of Birth</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                value={birthDate ? birthDate : ""}
                onChange={(e) => setbirthDate(e.target.value)}
                min={"1950-01-01"}
                max={"2010-01-01"}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              m={"auto"}
              type={"submit"}
              disabled={birthDate === user?.birthDate ? true : false}
              onClick={onClose}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const ProfileSettingGender = ({ user, gender, setGender }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text as={Link} color="#D54B79" onClick={onOpen}>
        {user?.gender ? "Change" : "Add"}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Add Gender</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormHelperText mb={5} textAlign={"center"}>
                Make sure the data is correct
              </FormHelperText>
              <RadioGroup
                onChange={setGender}
                value={gender}
                defaultChecked={gender}
              >
                <Stack direction="row" justifyContent={"center"} gap={5}>
                  <Radio value="Pria">Man</Radio>
                  <Radio value="Wanita">Woman</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              m={"auto"}
              type={"submit"}
              disabled={gender === user?.gender ? true : false}
              onClick={onClose}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
