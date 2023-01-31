import { Box, Button, Divider, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const CartSummary = ({ selectedCart, totalPriceCart }) => {
  const navigate = useNavigate();
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
        <Button
          colorScheme={"pink"}
          w={"100%"}
          onClick={() => navigate("/cart/checkout")}
        >
          Buy ({selectedCart})
        </Button>
      </Box>
    </>
  );
};
