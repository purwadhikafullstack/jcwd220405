import React from "react";

import {
  Box,
  Button,
  Image,
  Text,
  Icon,
  Checkbox,
  Divider,
  Input,
} from "@chakra-ui/react";
import { RiDeleteBinLine } from "react-icons/ri";

import { Link } from "react-router-dom";

export const CartCard = ({
  cart,
  selectCart,
  baseServer,
  deleteCart,
  updateCart,
  quantity,
  setQuantity,
}) => {
  return (
    <>
      {cart?.map((item, index) => {
        return (
          <Box key={index}>
            <Divider mt={"4"} borderTop={"4px"} borderBottom={"2px"} />
            <Box display={"flex"} alignItems={"center"} gap={"4"} mt={"4"}>
              <Box>
                <Checkbox
                  colorScheme={"pink"}
                  defaultChecked={item?.status ? true : false}
                  onChange={() => selectCart(item)}
                ></Checkbox>
              </Box>
              <Box
                as={Link}
                to={`/product/${item.Product.name}`}
                display={"flex"}
                alignItems={"center"}
                gap={"4"}
              >
                <Box
                  minW="100px"
                  minH="100px"
                  overflow="hidden"
                  borderWidth="1px"
                >
                  <Image
                    objectFit="cover"
                    width="100px"
                    height="100px"
                    src={`${baseServer}${item?.Product.Product_Images[0].image}`}
                  />
                </Box>
                <Box>
                  <Box>
                    <Text color={"rgb(213, 75, 121)"} fontWeight={"semibold"}>
                      {item?.Product.name}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">
                      {item?.Product.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              gap={{ base: "4", md: "14" }}
            >
              <Box>
                <Box>
                  <Button
                    onClick={() => deleteCart(item)}
                    variant={"unstyled"}
                    color={"rgb(213, 75, 121)"}
                  >
                    <Icon as={RiDeleteBinLine} transform={"scale(1.69)"} />
                  </Button>
                </Box>
              </Box>
              <Box display={"flex"} w={"120px"}>
                <Box pt={"2"}>
                  <Button
                    border={"2px"}
                    borderRadius={"50%"}
                    borderColor={"rgb(213, 75, 121)"}
                    color={"rgb(213, 75, 121)"}
                    size={"xs"}
                    variant={"unstyled"}
                    onClick={() => {
                      updateCart(item, "-");
                      setQuantity(quantity[index] - 1);
                    }}
                    disabled={quantity[index] <= 1 ? true : false}
                  >
                    -
                  </Button>
                </Box>
                <Box textAlign={"center"}>
                  <Input
                    type={"number"}
                    min={1}
                    max={5}
                    variant="flushed"
                    // defaultValue={quantity[index]}
                    value={quantity[index]}
                    textAlign={"center"}
                    onChange={(e) => {
                      if (e.target.value > 5) {
                        updateCart(item, "", 5);
                        return 0;
                      }
                      if (e.target.value < 1) {
                        updateCart(item, "", 1);
                        return 0;
                      }
                      updateCart(item, "", e.target.value);
                    }}
                    _focus={{
                      borderBottom: "2px",
                      borderBottomColor: "rgb(213, 75, 121)",
                    }}
                  />
                </Box>
                <Box pt={"2"}>
                  <Button
                    border={"2px"}
                    borderRadius={"50%"}
                    borderColor={"rgb(213, 75, 121)"}
                    color={"rgb(213, 75, 121)"}
                    size={"xs"}
                    variant={"unstyled"}
                    onClick={() => {
                      updateCart(item, "+");
                      setQuantity(quantity[index] + 1);
                    }}
                    disabled={quantity[index] >= 5 ? true : false}
                  >
                    +
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
};
