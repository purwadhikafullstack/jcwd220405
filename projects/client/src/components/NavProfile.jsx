import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import "./NavProfile.css";

const bar = [
  {
    title: "Personal Bio",
    path: "/profile/settings",
  },
  {
    title: "Address List",
    path: "/profile/settings/address",
  },
];

export const NavProfile = () => {
  const location = useLocation();
  return (
    <Flex gap={5} justifyContent={"flex-start"} ml={"1.5"}>
      {bar.map((item, index) => {
        return (
          <Box
            key={index}
            as={Link}
            to={item.path}
            className={location.pathname === item.path ? "select" : ""}
            _hover={{ color: "#E73891" }}
          >
            {item.title}
          </Box>
        );
      })}
    </Flex>
  );
};
