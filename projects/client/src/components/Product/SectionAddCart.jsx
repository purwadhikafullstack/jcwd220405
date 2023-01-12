import React from "react";
import {
  Box,
  Button,
  Divider,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";

export const SectionAddCart = ({
  totalStock,
  quantity,
  setQuantity,
  subtotal,
}) => {
  return (
    <>
      <Box
        borderColor="rgb(213, 75, 121)"
        borderRadius="md"
        borderWidth="2px"
        p={3}
      >
        <Text>Set the quantity</Text>
        <Divider my={"3"} />
        <Box display={"flex"} gap={2} alignItems={"center"} mb={"5"}>
          <Box width={"45%"} hidden={totalStock ? false : true}>
            <NumberInput
              size={"md"}
              defaultValue={quantity}
              min={1}
              max={totalStock}
              borderColor={"gray"}
            >
              <NumberInputField
                accept="num"
                onChange={(e) => {
                  setQuantity(+e.target.value);
                  if (e.target.value === "") {
                    setQuantity(0);
                    return 0;
                  }
                  if (e.target.value < 1) {
                    return setQuantity(1);
                  }
                  if (e.target.value > totalStock) {
                    return setQuantity(totalStock);
                  }
                }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper
                  bg="rgb(213, 75, 121)"
                  children="+"
                  onClick={() => {
                    if (quantity !== totalStock) setQuantity(quantity + 1);
                  }}
                />
                <NumberDecrementStepper
                  bg="rgb(213, 75, 121)"
                  children="-"
                  onClick={() => {
                    if (quantity > 1) setQuantity(quantity - 1);
                  }}
                />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Text>
            Stock:{" "}
            <Text as={"span"} fontWeight="bold" color={"rgb(213, 75, 121)"}>
              {totalStock}
            </Text>
          </Text>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} mb={"4"}>
          <Text color={"gray"}>Subtotal</Text>
          <Text fontWeight="bold" color={"rgb(213, 75, 121)"}>
            {`Rp${(subtotal * quantity).toLocaleString()}`}
          </Text>
        </Box>
        <Box>
          <Button
            w={"100%"}
            colorScheme={"pink"}
            onClick={() => alert("login first")}
          >
            + Keranjang
          </Button>
        </Box>
      </Box>
    </>
  );
};
