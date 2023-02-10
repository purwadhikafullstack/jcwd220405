import React from "react";

import { Box, Container, Divider, Text, Stack } from "@chakra-ui/react";

import { Shipment } from "./Shipment";

export const CheckoutShipment = () => {
  return (
    <Container
      justifyContent="center"
      maxWidth={"80%"}
      display={"flex"}
      flexDirection={{ base: "column", md: "row" }}
      color={"white"}
      border={"2px"}
      borderColor="gray.200"
      borderRadius="lg"
      borderTop={0}
      borderTopRadius={0}
    >
      <Box width={{ base: "100%", md: "70%" }} p={2}>
        <Box
          display={"flex"}
          flexDirection={{ base: "column", md: "row" }}
          gap={"4"}
          w="inherit"
        >
          <Stack border={"2px"} p={2}>
            <Text fontSize={"2xl"}>Shipment</Text>
            <Divider w={"inherit"} borderTop={"1px"} borderBottom={"2px"} />
          </Stack>
        </Box>
        <Shipment />
      </Box>
    </Container>
  );
};
