import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";

export const FilterProduct = ({
  valueMax,
  setValueMax,
  valueMin,
  setValueMin,
  setPrice,
  product,
  pmax,
  pmin,
}) => {
  return (
    <>
      <Box
        pt={"2.5"}
        m={{ base: "auto", md: "0" }}
        mb={"6"}
        hidden={product?.length ? false : true}
      >
        <Box mb={"12px"} display={"flex"} gap={"1"}>
          <Text fontWeight={"bold"}>Filter</Text>
          <Text
            fontWeight={"semibold"}
            color={"#D54B79"}
            textDecoration={"underline"}
            cursor={"pointer"}
            hidden={pmax || pmin ? false : true}
            onClick={() => window.location.reload()}
            fontSize={"12px"}
          >
            Reset
          </Text>
        </Box>
        <Box
          borderColor="whiteAlpha.400"
          borderRadius=".4em"
          borderWidth="2px"
          p={2}
          mb={"6px"}
        >
          <Box display={"flex"} flexDirection={"column"} gap={"4"}>
            <Text>Price</Text>
            <InputGroup mb={"4px"}>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
                children="Rp"
              />
              <Input
                placeholder="Minimum Price"
                onChange={(e) => setValueMin(e.target.value)}
                onMouseLeave={() => {
                  setPrice();
                }}
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
                onMouseLeave={() => setPrice()}
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
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </>
  );
};
