import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { Box, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const HomeProduct = () => {
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  const getProduct = useCallback(async () => {
    try {
      const response = await (await axios.get(`${baseApi}/product/home`)).data;
      setProduct(response.result);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  function toDetail(item) {
    navigate(`product/${item.name}`);
  }

  const crossTitle = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  return (
    <Box maxW={"full"}>
      <Box maxW={"85%"} m={"auto"}>
        <Swiper
          freeMode={true}
          grabCursor={true}
          modules={[FreeMode]}
          className="mySwiper"
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 5,
            },
            505: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            808: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            1111: {
              slidesPerView: 4,
              spaceBetween: 15,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
          }}
        >
          {product ? (
            product?.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <Box
                    onClick={() => toDetail(item)}
                    w="234px"
                    h="292px"
                    m={"8px auto 8px"}
                    borderRadius={"md"}
                    boxShadow={"0 0 4px 1px rgba(255,255,255,.59)"}
                    cursor={"pointer"}
                  >
                    <Box
                      h="165px"
                      w="full"
                      borderTopRadius="md"
                      overflow="hidden"
                    >
                      <Image
                        src={`${process.env.REACT_APP_SERVER}${
                          item?.Product_Images
                            ? item?.Product_Images[0].image
                            : `/public/product/default-product.png`
                        }`}
                        alt={item?.name}
                        width="full"
                        height="full"
                        bgGradient={
                          (index + 1) % 2 === 0
                            ? "linear(to-r, rgba(44, 22, 88, 0.69) 15%, #262A6E 100%)"
                            : "linear(to-l, rgba(44, 22, 88, 0.69) 15%, #262A6E 100%)"
                        }
                      />
                    </Box>
                    <Box px="4px" h="44%">
                      <Box h="66%" p={2} overflow={"hidden"}>
                        <Text
                          fontWeight={"semibold"}
                          _hover={{ color: "rgb(213, 75, 121)" }}
                        >
                          {crossTitle(item?.name, 55)}
                        </Text>
                      </Box>
                      <Box p={2}>
                        <Text fontWeight="bold" color={"rgb(213, 75, 121)"}>
                          {`Rp${item?.price?.toLocaleString()}`}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </SwiperSlide>
              );
            })
          ) : (
            <Stack>
              <Skeleton height="100px" />
            </Stack>
          )}
        </Swiper>
      </Box>
    </Box>
  );
};
