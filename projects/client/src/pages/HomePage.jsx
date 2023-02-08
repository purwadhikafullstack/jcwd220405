import React from "react";
import { Box, Image, Center, Divider, Heading } from "@chakra-ui/react";

// image
import banner2 from "../assets/anoun2.png";

// components
import { CarouselBanner } from "../components/CarouselBanner";
import { FeaturedCategories } from "../components/FeatCategories";
import { HomeProduct } from "../components/Product/HomeProduct";

export const HomePage = () => {
  return (
    // bgGradient="linear(to-br, #3B0D2C, #260843)"
    <Box>
      <CarouselBanner />
      <Center>
        <Image
          src={banner2}
          minW={{ base: "auto", lg: "1400px" }}
          minH={{ base: "70px", lg: "auto" }}
          padding={"30px"}
          pt={0}
        />
      </Center>
      {/* <FeaturedCategories /> */}
      <Box mb={"8"} color={"white"}>
        <Box maxW={"85%"} m={"auto"}>
          <Divider border={"2px"} mb={"2"} />
          <Heading mb={"2"} size={"lg"} color={"#D0BDAC"} fontWeight={"bold"}>
            Mokomdo Choice's
          </Heading>
        </Box>
        <Box display={"flex"} justifyContent={"center"} mb={"6"}>
          <HomeProduct />
        </Box>
        <Box maxW={"85%"} m={"auto"}>
          <Divider border={"2px"} />
        </Box>
      </Box>
    </Box>
  );
};
