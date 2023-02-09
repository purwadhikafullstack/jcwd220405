import { useSelector } from "react-redux";

import { CgShoppingCart } from "react-icons/cg";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useToast,
} from "@chakra-ui/react";
import empty_cart from "../../assets/empty-cart.png";

import { useNavigate, Link } from "react-router-dom";

export const CartButton = () => {
  const toast = useToast();
  const { name } = useSelector((state) => state.userSlice.value);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cartSlice.value);

  const onClickCart = () => {
    if (name) {
      return navigate("/cart");
    } else {
      toast({
        title: "Failed Attempt",
        description: "Please sign in",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const renderCart = () => {
    return cart?.map((item, index) => {
      return (
        <Box
          key={index}
          color={"#1E1C1C"}
          transition={".23s color"}
          _hover={{ color: "#D54B79" }}
          mb={"2"}
        >
          <Box
            display={"flex"}
            gap={"1"}
            alignItems={"center"}
            as={Link}
            to={`/product/${item?.Product?.name}`}
          >
            <Box minH={"75px"} minW={"75px"}>
              <Image
                w="75px"
                h="75px"
                objectFit="cover"
                borderRadius="lg"
                src={`${process.env.REACT_APP_SERVER}${item?.Product?.Product_Images[0]?.image}`}
              />
            </Box>
            <Box>
              <Text fontWeight="bold" fontSize="sm">
                {crossTitle(item?.Product?.name, 25)}
              </Text>
              <Text color="gray.600" fontWeight="600" fontSize="sm">
                X{item?.quantity}({item?.Product?.weight} g)
              </Text>
            </Box>
            <Box>
              <Text color={"#D54B79"} fontWeight={"semibold"}>
                Rp{item?.Product?.price?.toLocaleString()}
              </Text>
            </Box>
          </Box>
          <Divider border={"1px"} mt={"3"} />
        </Box>
      );
    });
  };

  const crossTitle = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  return (
    <Box color={"#1E1C1C"} position={"relative"}>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Box>
            <IconButton
              color="#D54B79"
              variant="ghost"
              icon={<CgShoppingCart />}
              onClick={() => onClickCart()}
              width={70}
              height={30}
              borderRadius={0}
              borderRight={"1px solid white"}
              fontSize={"35px"}
              _hover={{
                bg: "none",
                color: "#C146ED",
              }}
              _active={{ color: "white" }}
            ></IconButton>
            {cart?.length ? (
              <>
                <Badge
                  position={"absolute"}
                  right={"3"}
                  top={"-.3em"}
                  borderRadius={"45%"}
                  backgroundColor={"#D0BDAC"}
                  color={"#D54B79"}
                  userSelect={"none"}
                  hidden={name && cart?.length ? false : true}
                >
                  {cart?.length}
                </Badge>
              </>
            ) : null}
          </Box>
        </PopoverTrigger>
        <PopoverContent
          overflowY="scroll"
          overflowX={"hidden"}
          maxH={cart?.length ? "50vh" : ""}
        >
          <PopoverHeader
            display="flex"
            justifyContent="space-between"
            color={"#D54B79"}
          >
            <Text>Cart {cart?.length ? `(${cart?.length})` : ""}</Text>
            <Text
              fontWeight={"bold"}
              as={Link}
              to="/cart"
              hidden={name ? false : true}
            >
              See Now
            </Text>
          </PopoverHeader>
          {cart?.length ? (
            <PopoverBody>{renderCart()}</PopoverBody>
          ) : (
            <PopoverBody>
              <Box>
                <Image src={empty_cart} ml="4" />
              </Box>
              <Text align="center" fontWeight="semibold" color={"#D54B79"}>
                Wow, your shopping cart is empty!
              </Text>
            </PopoverBody>
          )}
        </PopoverContent>
      </Popover>
    </Box>
  );
};
