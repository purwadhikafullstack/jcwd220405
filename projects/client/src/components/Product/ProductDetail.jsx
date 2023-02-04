import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import { Box, Container, Divider, Text, useMediaQuery } from "@chakra-ui/react";

import { ProductDetailImage } from "./ProductDetailImage";
import { SectionAddCart } from "./SectionAddCart";

const baseApi = process.env.REACT_APP_API_BASE_URL;
const baseServer = process.env.REACT_APP_SERVER;

export const ProductDetail = () => {
  const [setDir] = useMediaQuery("(max-width: 1050px)");
  const { name } = useParams();
  const [product, setProduct] = useState([]);
  const [imageProduct, setImageProduct] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [weight, setWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [subtotal, setSubtotal] = useState(0);
  const [category, setCategory] = useState();
  const url_detail = `${baseApi}/product/detail/${name}`;

  const getProduct = useCallback(async () => {
    const response = await (await axios.get(url_detail)).data;
    setProduct(response.result);
    setCategory(response.result.Product_Category.category);
    setImageProduct(response.result.Product_Images);
    setSubtotal(response.result.price);
    setWeight(response.weight);
    setTotalStock(response.stock);
  }, [url_detail]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);
  return (
    <Container
      maxW={"inherit"}
      minH={"85.5vh"}
      color={"white"}
      px={{ base: "4", md: "32" }}
    >
      <Box
        display={"flex"}
        flexDirection={setDir ? "column" : "row"}
        gap={{ base: "2", md: "4" }}
      >
        <Box px={6} pt={2} m={setDir ? "auto" : "0"}>
          <ProductDetailImage
            baseServer={baseServer}
            imageProduct={imageProduct}
          />
        </Box>
        <Box p={2} px={6} w={setDir ? "100%" : "40%"}>
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
              {`Rp${product?.price?.toLocaleString()}`}
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
                to={`/product?search_query=${category}`}
                color={"rgb(213, 75, 121)"}
                textTransform={"capitalize"}
                fontWeight={"semibold"}
              >
                {category}
              </Text>
            </Text>
          </Box>
          <Box h={"242px"} overflow={"auto"}>
            <Text>{product?.desc}</Text>
          </Box>
        </Box>
        <Box px={"6"} pt={4}>
          <SectionAddCart
            quantity={quantity}
            setQuantity={setQuantity}
            subtotal={subtotal}
            totalStock={totalStock}
            product={product}
            baseApi={baseApi}
            baseServer={baseServer}
            imageProduct={imageProduct}
          />
        </Box>
      </Box>
    </Container>
  );
};
