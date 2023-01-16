import { Box, Button, Divider, Text } from "@chakra-ui/react";
import React from "react";

export const CartSummary = ({ selectedCart, totalPriceCart }) => {
  return (
    <>
      <Text>Shopping Summary</Text>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box>
          <Text>Total Price ({selectedCart} item)</Text>
        </Box>
        <Box>
          <Text>
            {totalPriceCart ? `Rp${totalPriceCart.toLocaleString()}` : "Rp0"}
          </Text>
        </Box>
      </Box>
      <Divider />
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box>
          <Text>Total Price</Text>
        </Box>
        <Box>
          <Text>
            {totalPriceCart ? `Rp${totalPriceCart.toLocaleString()}` : "-"}
          </Text>
        </Box>
      </Box>
      <Box>
        <Button colorScheme={"pink"} w={"100%"} onClick={() => alert("yyy")}>
          Buy ({selectedCart})
        </Button>
      </Box>
    </>
  );
};
