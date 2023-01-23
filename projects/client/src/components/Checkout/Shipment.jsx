import {
  Container,
  Box,
  Divider,
  Text,
  Button,
  Image,
  Select,
} from "@chakra-ui/react";
import gameboy from "../../assets/gameboy.jpg";

export const Shipment = () => {
  return (
    <Box mt={5}>
      <Box>
        <Box mb={5}>
          <Text>Gudang Mana</Text>
        </Box>
        <Box
          display={"flex"}
          flexDirection={{ base: "column", md: "row" }}
          mb={5}
        >
          <Box w={20} mr={5} border={"2px"} borderRadius="lg" borderColor={""}>
            <Image src={gameboy} alt="product" w="inherit" />
          </Box>
          <Box w={{ base: "100%", md: "70%" }} mt={2}>
            <Text>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Commodisssssssssss
            </Text>
            <Text mt={5}>Weight: item weight x sum item</Text>
          </Box>
        </Box>
      </Box>
      <Box w={{ base: "100%", md: "70%" }}>
        <Box mb={2}>Shipment Duration</Box>
        <Box>
          <Select
            placeholder="Shipment"
            colorScheme={"pink"}
            textColor="black"
            bg={"#D54B79"}
            // m="auto"
            mb={5}
            borderColor="gray"
            fontWeight={600}
          >
            <option value="option 1" color="salmon">
              Option 1
            </option>
            <option value="option 1">Option 2</option>
            <option value="option 1">Option 3</option>
          </Select>
        </Box>
      </Box>
    </Box>
  );
};
