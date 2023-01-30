import React from "react";

import {
  Box,
  Image,
  Text,
  Divider,
  Heading,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { GrSend } from "react-icons/gr";

export const OrderListCard = ({
  orderList,
  crossTitle,
  rejectOrder,
  confirmOrder,
}) => {
  return (
    <>
      <Box>
        <Divider my={"2"} borderTop={"4px"} borderBottom={"2px"} />
      </Box>
      {orderList?.length ? (
        <Box>
          {orderList?.map((item) => {
            return item?.Transaction_Product_Warehouses?.map((item2, index) => {
              return (
                <Box key={index} mb={"4"}>
                  <Box border={"2px"} borderRadius={"md"} py={"1"}>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      borderBottom={"2px"}
                      px={"2"}
                      pb={"1"}
                    >
                      <Box>
                        <Text>
                          {item2?.Warehouse?.warehouse_name}/{item?.invoice}
                        </Text>
                      </Box>
                      <Box>
                        <Tooltip label={item?.Order_Status?.status}>
                          <Text>
                            {item?.OrderStatusId === 2
                              ? crossTitle(item?.Order_Status?.status, 9, -6)
                              : crossTitle(item?.Order_Status?.status, 0)}
                          </Text>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      p={"2"}
                      justifyContent={"space-between"}
                    >
                      <Box display={"flex"} alignItems={"center"} gap={"4"}>
                        <Box
                          minW="100px"
                          minH="100px"
                          overflow="hidden"
                          borderWidth="1px"
                          borderRadius={"md"}
                        >
                          <Image
                            objectFit="cover"
                            width="100px"
                            height="100px"
                            alt="Image Transactions"
                            // src?
                          />
                        </Box>
                        <Box>
                          <Box>
                            <Text
                              color={"rgb(213, 75, 121)"}
                              fontWeight={"semibold"}
                            >
                              {item?.User?.name}
                            </Text>
                          </Box>
                          <Box>
                            <Tooltip hasArrow label={item2?.Product?.name}>
                              <Text fontWeight="bold">
                                {crossTitle(item2?.Product?.name, 0, 44)}
                              </Text>
                            </Tooltip>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">
                              {item2?.price?.toLocaleString()} X{" "}
                              {item2?.quantity}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        gap={{ base: "2", md: "4" }}
                      >
                        <Button
                          hidden={item?.OrderStatusId === 3 ? false : true}
                          variant={"outline"}
                          borderWidth={"2px"}
                          borderColor={"rgba(55,5,55,.96)"}
                          bgColor={"transparent"}
                          _active={{ bgColor: "transparent" }}
                          _hover={{
                            bgColor: "transparent",
                            transform: "scale(1.1)",
                          }}
                          rightIcon={<GrSend />}
                        >
                          Send
                        </Button>
                        <Button
                          variant={"outline"}
                          borderWidth={"2px"}
                          borderColor={"rgba(55,5,55,.96)"}
                          bgColor={"transparent"}
                          _active={{ bgColor: "transparent" }}
                          _hover={{
                            bgColor: "transparent",
                            transform: "scale(1.1)",
                          }}
                          hidden={item?.OrderStatusId === 2 ? false : true}
                          onClick={() => confirmOrder(item.id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant={"outline"}
                          border={"none"}
                          bgColor={"rgba(55,5,55,.96)"}
                          color={"white"}
                          _active={{ bgColor: "transparent" }}
                          _hover={{
                            bgColor: "transparent",
                            color: "black",
                            border: "2px",
                            borderColor: "rgba(55,5,55,.96)",
                          }}
                          hidden={item?.OrderStatusId === 2 ? false : true}
                          onClick={() =>
                            rejectOrder(item.id, item.OrderStatusId)
                          }
                        >
                          Reject
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            });
          })}
        </Box>
      ) : (
        <Box p={"8"} textAlign={"center"}>
          <Heading size={"xl"}>No Transactions in this Warehouse</Heading>
        </Box>
      )}
    </>
  );
};
