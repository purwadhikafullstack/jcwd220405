import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  Box,
  Container,
  Divider,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";

import { ProductDetailImage } from "./ProductDetailImage";
import { SectionAddCart } from "./SectionAddCart";

const baseApi = process.env.REACT_APP_API_BASE_URL;
const baseServer = process.env.REACT_APP_SERVER;

export const ProductDetail = () => {
  const { name } = useParams();
  const [product, setProduct] = useState([]);
  const [imageProduct, setImageProduct] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [weight, setWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [subtotal, setSubtotal] = useState(0);
  const url_detail = `${baseApi}/product/detail/${name}`;

  const getProduct = async () => {
    const response = await (await axios.get(url_detail)).data;
    setProduct(response);
    setImageProduct(response.Product_Images);
    const stock = response.Details.map((item) => item.stocks).reduce(
      (a, b) => a + b,
      0
    );
    if (response.weight >= 1000) {
      const weight = response.weight / 1000;
      setWeight(weight);
    }
    setTotalStock(stock);
    setSubtotal(response.price);
  };

  useEffect(() => {
    getProduct();
  }, []);
  return (
    <Container maxW={"inherit"} h={"85vh"} color={"white"} px={"32"}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={2}
        templateRows={{ base: "repeat(3, 1fr)", md: 1 }}
      >
        <GridItem px={6} pt={2} gridRow={{ base: 1, md: 1 }}>
          <ProductDetailImage
            baseServer={baseServer}
            imageProduct={imageProduct}
          />
        </GridItem>
        <GridItem p={2} gridRow={{ base: 2, md: 1 }}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"extrabold"}>
              {product?.name}
            </Text>
            <Text
              fontWeight="bold"
              fontSize={"2xl"}
              _hover={{ fontStyle: "italic" }}
              color={"rgb(213, 75, 121)"}
            >
              {`Rp${product.price?.toLocaleString()}`}
            </Text>
          </Box>
          <Divider my={"3"} />
          <Box mb={"3"} color={"gray"}>
            <Text>Condition: New</Text>
            <Text>Status: {totalStock ? "Ready" : "Out of Stock"}</Text>
            <Text>
              Unit Weight: {weight ? weight : product?.weight}{" "}
              {product?.weight < 1000 ? "g" : "kg"}
            </Text>
            <Text>
              Category:{" "}
              <Text
                as={Link}
                to={`/product?search_query=${product?.category}`}
                color={"rgb(213, 75, 121)"}
                textTransform={"capitalize"}
                fontWeight={"semibold"}
              >
                {product?.category}
              </Text>
            </Text>
          </Box>
          <Box h={"242px"} overflow={"auto"}>
            <Text>{product?.desc}</Text>
          </Box>
        </GridItem>
        <GridItem px={"16"} pt={4} gridRow={{ base: 3, md: 1 }}>
          <SectionAddCart
            quantity={quantity}
            setQuantity={setQuantity}
            subtotal={subtotal}
            totalStock={totalStock}
            product={product}
            baseApi={baseApi}
            baseServer={baseServer}
          />
        </GridItem>
      </Grid>
    </Container>
  );
};
