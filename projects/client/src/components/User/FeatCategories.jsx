// react
import React, { Component } from "react";

// carousel
import { Carousel } from "react-responsive-carousel";

// image
import cat1 from "../../assets/cat1.png";
import cat2 from "../../assets/cat2.png";
import cat3 from "../../assets/cat3.png";
import cat4 from "../../assets/cat4.png";
import cat5 from "../../assets/cat5.png";
import cat6 from "../../assets/cat6.png";

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

// icon
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

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
          <Container paddingBottom={{ base: 4 }} border={"1px solid white"}>
          {/* <Center> */}
            <Grid
              templateColumns={"repeat(3, 1fr)"}
              gap={{ base: 2 }}
              border={"1px solid red"}
              // w={{base: "md",lg: "7xl"}}
            >
              <Center border={"1px solid yellow"}>
                <GridItem colSpan={1} border={"1px solid white"} h={{base: "30px",lg: "50px"}}>
                  {/* <Text
                    color={"white"}
                    fontSize={{ base: "10px", md: "18px" }}
                    w={{ lg: "300px" }}
                    textAlign={"center"}
                  >
                    Featured Categories
                  </Text> */}
                </GridItem>
              {/* </Center> */}
              {/* <Center> */}
                <GridItem colSpan={1} border={"1px solid white"}>
                  {/* <Center>
                    <Divider
                      w={{ base: "100px", md: "350px", lg: "500px" }}
                      borderBottom={"2px solid white"}
                      opacity={"100%"}
                      py={{ base: 1, lg: 3 }}
                      // marginLeft={"15px"}
                    />
                  </Center> */}
                </GridItem>
              {/* </Center> */}
              {/* <Center> */}
                <GridItem
                  colSpan={1}
                  border={"1px solid white"}
                  width={{ base: "60px" }}
                >
                  {/* <Center>
                    <Flex border={"1px solid white"}>
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
                  </Center> */}
                </GridItem>
              </Center>
            </Grid>
          </Container>
          {/* </Center> */}
          <Center>
            {isMobile ? setSlider(17) : null}
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
              // centerSlidePercentage={0}
              // centerSlidePercentage={19}
              centerSlidePercentage={slider}
              selectedItem={this.state.currentSlide}
              onChange={this.updateCurrentSlide}
              h={{ base: "120px", md: "250px" }}
              w={"1400px"}
              // border={"1px solid blue"}
            >
              {PicBanner.map((pic, index) => {
                return (
                  <Center>
                    <Box
                      key={index}
                      // h={{ base: "200px", md: "200px" }}
                      w={{ base: "100px", md: "200px", lg: "250px" }}
                      // mx={"40%"}
                      // px={"50px"}
                      // border={"1px solid white"}
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
