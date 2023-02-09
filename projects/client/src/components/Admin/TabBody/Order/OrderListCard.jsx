import {
  Box,
  Image,
  Text,
  Divider,
  Heading,
  Button,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { GrSend } from "react-icons/gr";

import mpay from "../../../../assets/mpay.png";

const baseServer = process.env.REACT_APP_SERVER;

export const OrderListCard = ({
  orderList,
  crossTitle,
  rejectOrder,
  confirmOrder,
  sendOrder,
  cancelOrder,
}) => {
  return (
    <>
      <Box>
        <Divider my={"2"} borderTop={"4px"} borderBottom={"2px"} />
      </Box>
      {orderList?.length ? (
        <Box>
          <Accordion allowToggle>
            {orderList?.map((item, index) => {
              return (
                <Box key={index}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        _expanded={{ bg: "#351734", color: "white" }}
                      >
                        <Box as="span" flex="1" textAlign="left">
                          {
                            item?.Transaction_Product_Warehouses[0]?.Warehouse
                              .warehouse_name
                          }
                          /{item?.invoice}/
                          <Tooltip label={item?.Order_Status?.status}>
                            <span>
                              {item?.OrderStatusId === 2
                                ? crossTitle(item?.Order_Status?.status, 9, -6)
                                : crossTitle(item?.Order_Status?.status, 0)}
                            </span>
                          </Tooltip>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        p={"2"}
                        justifyContent={"space-between"}
                        gap={"2"}
                      >
                        <Box display={"flex"} alignItems={"center"} gap={"2"}>
                          <Box
                            minW="100px"
                            minH="100px"
                            overflow="hidden"
                            borderWidth="1px"
                            borderRadius={"md"}
                          >
                            <a
                              href={`${baseServer}${item?.payment_proof}`}
                              target={"_blank"}
                              rel="noopener noreferrer"
                            >
                              <Image
                                objectFit="cover"
                                width="100px"
                                height="100px"
                                alt="Image Transactions"
                                src={
                                  item?.payment_proof
                                    ? `${baseServer}${item?.payment_proof}`
                                    : mpay
                                }
                              />
                            </a>
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
                              <Text fontWeight="bold">
                                Rp{item?.final_price?.toLocaleString()}
                              </Text>
                            </Box>
                            <Box
                              hidden={
                                item?.Transaction_Product_Warehouses?.length < 2
                                  ? true
                                  : false
                              }
                            >
                              <Text fontWeight="normal">
                                +
                                {item?.Transaction_Product_Warehouses?.length -
                                  1}{" "}
                                other products
                              </Text>
                            </Box>
                            <Box>
                              <Text fontWeight="bold">
                                <span style={{ fontWeight: "normal" }}>
                                  Send to{" "}
                                </span>
                                {item?.Address_User?.received_name}{" "}
                                {item?.Address_User?.city},{" "}
                                {item?.Address_User?.province}
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
                            onClick={() => sendOrder(item.id)}
                          >
                            Send
                          </Button>
                          <Button
                            hidden={item?.OrderStatusId === 3 ? false : true}
                            variant={"outline"}
                            border={"none"}
                            bgColor={"rgba(55,5,55,.96)"}
                            color={"white"}
                            _active={{ bgColor: "transparent" }}
                            _hover={{
                              bgColor: "transparent",
                              transform: "scale(1.1)",
                              color: "black",
                              border: "2px",
                              borderColor: "rgba(55,5,55,.96)",
                            }}
                            onClick={() => cancelOrder(item.id)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant={"outline"}
                            borderWidth={"2px"}
                            borderColor={"rgba(55,5,55,.96)"}
                            bgColor={"transparent"}
                            _active={{ bgColor: "transparent" }}
                            _hover={{
                              bgColor: "transparent",
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
                            onClick={() => rejectOrder(item.id)}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                </Box>
              );
            })}
          </Accordion>
        </Box>
      ) : (
        <Box p={"8"} textAlign={"center"}>
          <Heading size={"xl"}>No Transactions in this Warehouse</Heading>
        </Box>
      )}
    </>
  );
};
