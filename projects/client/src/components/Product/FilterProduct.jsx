import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import React from "react";

export const FilterProduct = ({
  valueMax,
  setValueMax,
  valueMin,
  setValueMin,
  setPrice,
  click,
  setClick,
}) => {
  return (
    <>
      <Box
        w={{ base: "80%", md: "20%" }}
        pt={"2.5"}
        m={{ base: "auto", md: "0" }}
        mb={"6"}
      >
        <Box mb={"6px"}>
          <Text fontWeight={"bold"}>Filter</Text>
        </Box>
        <Box
          borderColor="whiteAlpha.400"
          borderRadius=".4em"
          borderWidth="2px"
          p={2}
          mb={"6px"}
        >
          <Box display={"flex"} flexDirection={"column"} gap={"4"}>
            <Text>Harga</Text>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
                children="Rp"
              />
              <Input
                placeholder="Minimum Price"
                onChange={(e) => setValueMin(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
                children="Rp"
              />
              <Input
                placeholder="Maximum Price"
                onChange={(e) => setValueMax(e.target.value)}
              />
            </InputGroup>
          </Box>
        </Box>
        <Box hidden={valueMin || valueMax ? false : true} textAlign={"right"}>
          <Button
            bg={"pink.400"}
            _hover={{
              bg: "pink.300",
            }}
            onClick={() => {
              setPrice();
              setClick(click + 1);
            }}
            disabled={click === 2 ? true : false}
          >
            Search
          </Button>
        </Box>
      </Box>
    </>
  );
};
