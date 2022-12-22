import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  useMediaQuery,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import React from "react";

export const Address = () => {
  const [isLessThan] = useMediaQuery("(max-width:596px)");
  return (
    <>
      <Flex
        justifyContent={"space-between"}
        direction={isLessThan ? "column" : "row"}
      >
        <Box>
          <InputGroup>
            <Input
              type={"search"}
              placeholder={"Cari alamat atau nama penerima"}
              _placeholder={{ fontSize: { base: "10px", md: "13px" } }}
            />
            <InputRightAddon bgColor={"#E73891"} border={"##E73891"} w={"15%"}>
              <Button
                bgColor={"transparent"}
                pos={"absolute"}
                right={"-.7em"}
                variant={"unstyled"}
              >
                <IoSearch />
              </Button>
            </InputRightAddon>
          </InputGroup>
        </Box>
        <Box>
          <Button bgColor={"#E73891"} _hover={{ opacity: ".88" }}>
            +Tambah Alamat Baru
          </Button>
        </Box>
      </Flex>
      <Flex direction={"column"}>
        <Box>al1</Box>
        <Box>al2</Box>
      </Flex>
    </>
  );
};
