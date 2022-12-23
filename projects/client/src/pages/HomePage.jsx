import React from "react";
import { Box, Image, Center } from "@chakra-ui/react";

// image
import banner2 from "../assets/anoun2.png";

// components
import { CarouselBanner } from "../components/CarouselBanner";
import { FeaturedCategories } from "../components/FeatCategories";

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
    </Box>
  );
};
