import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";

export const SortProduct = ({
  order,
  order_direction,
  setOrder,
  setOrder_direction,
}) => {
  return (
    <>
      <Box display={"flex"} gap={1} alignItems={"center"}>
        <Text fontWeight={"bold"}>Sort:</Text>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            border={"2px"}
            _hover={{
              borderColor: "rgb(213, 75, 121)",
              bgColor: "transparent",
            }}
            _active={{
              borderColor: "white",
              bgColor: "transparent",
            }}
            bgColor={"transparent"}
          >
            {order === "name" && order_direction === "ASC"
              ? "Best"
              : order === "price" && order_direction === "DESC"
              ? "Highest Price"
              : order === "price" && order_direction === "ASC"
              ? "Lowest Price"
              : order === "product_stocks" && order_direction === "DESC"
              ? "Stock Ready"
              : ""}
          </MenuButton>
          <MenuList minWidth="240px" color={"black"}>
            <MenuItem
              onClick={() => {
                setOrder("name");
                setOrder_direction("ASC");
              }}
            >
              Best
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOrder("price");
                setOrder_direction("DESC");
              }}
            >
              Highest Price
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOrder("price");
                setOrder_direction("ASC");
              }}
            >
              Lowest Price
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOrder("product_stocks");
                setOrder_direction("DESC");
              }}
            >
              Stock Ready
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </>
  );
};
