import {
  Box,
  Button,
  Image,
  Text,
  Icon,
  Checkbox,
  Divider,
  Input,
  useMediaQuery,
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
}) => {
  const [setSize] = useMediaQuery("(max-width: 369px)");

  const crossTitle = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };
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
                to={`/product/${item?.Product?.name}`}
                display={"flex"}
                alignItems={"center"}
                gap={"4"}
              >
                <Box
                  minW={setSize ? "50px" : "100px"}
                  minH={setSize ? "50px" : "100px"}
                  overflow="hidden"
                  borderWidth="1px"
                >
                  <Image
                    objectFit="cover"
                    width={setSize ? "50px" : "100px"}
                    height={setSize ? "50px" : "100px"}
                    src={`${baseServer}${item?.Product?.Product_Images[0]?.image}`}
                  />
                </Box>
                <Box>
                  <Box>
                    <Text color={"rgb(213, 75, 121)"} fontWeight={"semibold"}>
                      {setSize
                        ? crossTitle(item?.Product?.name, 22)
                        : item?.Product?.name}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">
                      Rp{item?.Product?.price?.toLocaleString()}
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
                    max={item?.total_stocks}
                    variant="flushed"
                    value={quantity[index]}
                    textAlign={"center"}
                    onChange={(e) => {
                      if (e.target.value > +item?.total_stocks) {
                        updateCart(item, "", +item?.total_stocks);
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
                    }}
                    disabled={
                      quantity[index] >= +item?.total_stocks ? true : false
                    }
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
