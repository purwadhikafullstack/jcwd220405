import React, { Component } from "react";

// chakra
import {
  Box,
  Text,
  Center,
  Image,
  Grid,
  GridItem,
  Container,
  IconButton,
  Stack,
  Divider,
  useMediaQuery,
  Flex,
} from "@chakra-ui/react";

// carousel
import { Carousel } from "react-responsive-carousel";

// picture
import cat1 from "../assets/cat1.png";
import cat2 from "../assets/cat2.png";
import cat3 from "../assets/cat3.png";
import cat4 from "../assets/cat4.png";
import cat5 from "../assets/cat5.png";
import cat6 from "../assets/cat6.png";

// icon
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";

export const FeaturedCategories = () => {
  const PicBanner = [cat1, cat2, cat3, cat4, cat5, cat6];
  const [isMobile] = useMediaQuery("(max-width: 640px)");
  const [isTab1] = useMediaQuery("(min-width: 641px)");
  const [isTab2] = useMediaQuery("(max-width: 1007px)");
  const [isDesktop] = useMediaQuery("(min-width: 1008px)");
  const [slider, setSlider] = useState();

  class ExternalControlledCarousel extends Component {
    constructor(props) {
      super(props);

      this.state = {
        currentSlide: 1,
        autoPlay: true,
      };
    }

    next = () => {
      this.setState((state) => ({
        currentSlide: state.currentSlide + 1,
      }));
    };

    prev = () => {
      this.setState((state) => ({
        currentSlide: state.currentSlide - 1,
      }));
    };

    updateCurrentSlide = (index) => {
      const { currentSlide } = this.state;
      // console.log(currentSlide);
      if (currentSlide !== index) {
        this.setState({
          currentSlide: index,
        });
      }
      if (currentSlide > PicBanner.length - 2) {
        this.setState({
          currentSlide: 1,
        });
      }
      if (index === 0) {
        this.setState({
          currentSlide: PicBanner.length - 2,
        });
      }
    };

    render() {
      return (
        <Box paddingBottom={{ lg: 5 }}>
          <Container paddingBottom={{ base: 4 }}>
            <Center>
              <Grid templateColumns={"repeat(3, 1fr)"}>
                <GridItem colSpan={1}>
                  <Text
                    color={"white"}
                    fontSize={{ base: "10px", md: "18px" }}
                    py={{ lg: 2 }}
                    w={{ lg: "300px" }}
                    textAlign={"center"}
                  >
                    Featured Categories
                  </Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Center>
                    <Divider
                      w={{ base: "100px", md: "350px", lg: "800px" }}
                      borderBottom={"2px solid white"}
                      opacity={"100%"}
                      py={{ base: 1, lg: 3 }}
                      // marginLeft={"15px"}
                    />
                  </Center>
                </GridItem>
                <GridItem colSpan={1} w={{ base: "100px" }}>
                  <Center>
                    <Flex>
                      <IconButton
                        icon={<FaChevronLeft />}
                        color={"white"}
                        bg={"none"}
                        fontSize={{ base: "10px" }}
                        size={{ base: "xs", lg: "md" }}
                        _hover={{ bg: "none", color: "#C146ED" }}
                        onClick={this.prev}
                      />
                      <IconButton
                        icon={<FaChevronRight />}
                        color={"white"}
                        bg={"none"}
                        fontSize={{ base: "10px" }}
                        size={{ base: "xs", lg: "md" }}
                        _hover={{ bg: "none", color: "#C146ED" }}
                        onClick={this.next}
                      />
                    </Flex>
                  </Center>
                </GridItem>
              </Grid>
            </Center>
          </Container>
          <Center>
            {isMobile ? setSlider(16) : null}
            {isTab1 && isTab2 ? setSlider(19) : null}
            {isDesktop ? setSlider(30) : null}
            <Box
              as={Carousel}
              // gap={"100px"}
              // autoPlay={true}
              infiniteLoop={true}
              showThumbs={false}
              showArrows={false}
              showStatus={false}
              showIndicators={false}
              centerMode={true}
              // centerSlidePercentage={16}
              // centerSlidePercentage={19}
              centerSlidePercentage={slider}
              selectedItem={this.state.currentSlide}
              onChange={this.updateCurrentSlide}
              h={{ base: "120px", md: "250px" }}
              w={"1400px"}
            >
              {PicBanner.map((pic, index) => {
                return (
                  <Center key={index}>
                    <Box
                      // h={{ base: "200px", md: "200px" }}
                      w={{ base: "100px", md: "200px", lg: "250px" }}
                      // mx={"40%"}
                      // px={"50px"}
                    >
                      <Image
                        h={{ base: "100px", md: "200px", lg: "250px" }}
                        src={pic}
                        alt=""
                      />
                    </Box>
                  </Center>
                );
              })}
            </Box>
          </Center>
        </Box>
      );
    }
  }
  return <ExternalControlledCarousel />;
};
