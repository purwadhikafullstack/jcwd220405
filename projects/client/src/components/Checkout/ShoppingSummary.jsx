import { Box, Text, Spacer, Divider } from "@chakra-ui/react";

export const ShoppingSummary = ({
  finalPrice,
  productPriceTotal,
  quantity,
  deliveryFee,
}) => {
  return (
    <>
      <Box
        maxW={"100%%"}
        //   bgColor={"gray.300"}
        textColor={"black"}
        //   borderColor="black"
        bgGradient="linear-gradient(104.04deg, #E73A79 0%, rgba(231, 56, 145, 0.72) 54.88%, rgba(233, 54, 188, 0.77) 100%)"
        border={"2px"}
        borderRadius="10px"
        p={5}
      >
        <Text as={"b"}>Shoping Summary</Text>
        <Box mt={3} flexDirection={{ base: "column", md: "row" }}>
          <Box display={"flex"} flexDirection={{ base: "column", md: "row" }}>
            <Text>Total Harga ({quantity ? quantity : 0} item)</Text>
            <Spacer />
            <Text>
              {productPriceTotal
                ? `Rp${productPriceTotal.toLocaleString()}`
                : `Rp0`}
            </Text>
          </Box>
          <Box display={"flex"} flexDirection={{ base: "column", md: "row" }}>
            <Text>Total Ongkos Kirim</Text>
            <Spacer />
            <Text>
              {deliveryFee ? `Rp${deliveryFee.toLocaleString()}` : `Rp0`}
            </Text>
          </Box>
          <Divider mt={5} mb={5} borderTop={"1px"} borderBottom={"2px"} />
          <Box display={"flex"} flexDirection={{ base: "column", md: "row" }}>
            <Text as={"b"} fontSize={"lg"}>
              Total Transaksi
            </Text>
            <Spacer />
            <Text as={"b"} fontSize={"lg "}>
              {finalPrice ? `Rp${finalPrice.toLocaleString()}` : `Rp0`}
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};
