// caraousel
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// chakra
import {
  Box,
  Grid,
  GridItem,
  Image,
  Center,
} from "@chakra-ui/react";

// picture
import banner1 from "../assets/banner1.png";
import banner2_1 from "../assets/banner2.1.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";

export const CarouselBanner = () => {
  const PicBanner = [
    banner1,
    "https://imaging.nikon.com/lineup/dslr/df/img/sample/img_02_l.jpg",
    "https://www.cameraegg.org/wp-content/uploads/2016/01/Nikon-D500-Sample-Images-2.jpg",
  ];

  return (
    <Center>
      <Box w={"1400px"}>
        <Grid
          templateRows={{ base: "repeat(3, 1fr)", md: "repeat(2, 1fr)" }}
          templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(7, 1fr)" }}
          padding={"30px"}
          gap={{ base: "5px", md: "15px" }}
        >
          <GridItem
            rowSpan={{ base: 2, md: 2 }}
            colSpan={{ base: 3, md: 5 }}
            bg="#1E1C1C"
            h={{ base: "200px", md: "350px" }}
          >
            <Box
              as={Carousel}
              h={{ base: "200px", md: "350px" }}
              autoPlay={true}
              infiniteLoop={true}
              showThumbs={false}
              showArrows={false}
              showStatus={false}
              renderIndicator={(onClickHandler, isSelected, index, label) => {
                const defStyle = {
                  marginLeft: 10,
                  cursor: "fixed",
                  display: "inline-block",
                  transform: "skew(-50deg)",
                  background: "white",
                  height: "5px",
                  width: "30px",
                };
                const style = isSelected
                  ? {
                      ...defStyle,
                      background: "#440F5D",
                      height: "8px",
                      width: "35px",
                    }
                  : { ...defStyle };
                return (
                  <Box
                    style={style}
                    onClick={onClickHandler}
                    onKeyDown={onClickHandler}
                    display={"inline"}
                    key={index}
                    role="button"
                    aria-label={`Selected: ${label} ${index + 1}`}
                    title={`Selected: ${label} ${index + 1}`}
                  />
                );
              }}
            >
              {PicBanner.map((pic, index) => {
                return (
                  <Center key={index}>
                    <Image
                      h={{ base: "200px", md: "355px" }}
                      src={pic}
                      alt=""
                    />
                  </Center>
                );
              })}
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 2 }} h={{ md: "170px" }}>
            <Center>
              <Image
                h={{ base: "100px", md: "170px" }}
                w={"530px"}
                src={banner2_1}
                alt=""
              />
            </Center>
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <Center>
              <Image
                h={{ base: "100px", md: "170px" }}
                w={"190px"}
                src={banner3}
                alt=""
              />
            </Center>
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <Center>
              <Image
                h={{ base: "100px", md: "170px" }}
                w={"190px"}
                src={banner4}
                alt=""
              />
            </Center>
          </GridItem>
        </Grid>
      </Box>
    </Center>
  );
};
