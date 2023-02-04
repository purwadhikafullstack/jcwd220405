import { Box, Image } from "@chakra-ui/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./SwiperStyle.css";

export const ProductDetailImage = ({ imageProduct, baseServer }) => {
  return (
    <>
      <Box w={{ base: "248px", md: "369px" }} borderRadius="md">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {imageProduct?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <Image
                  src={
                    item?.image
                      ? `${baseServer}${item.image}`
                      : `${baseServer}/public/product/default-product.png`
                  }
                  alt={item?.name}
                  borderRadius={"xl"}
                  width="100%"
                  height="100%"
                  objectFit={"cover"}
                  bgGradient={
                    (index + 1) % 2 === 0
                      ? "linear(to-r, rgba(44, 22, 88, 0.69) 15%, #262A6E 100%)"
                      : "linear(to-l, rgba(44, 22, 88, 0.69) 15%, #262A6E 100%)"
                  }
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </>
  );
};
