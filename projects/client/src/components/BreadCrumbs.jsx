// image
import icon from "../assets/mokomdo-icon2.png";

// chakra
import {
  Box,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  Image,
} from "@chakra-ui/react";

// react icon
import { CgChevronRight } from "react-icons/cg";

export const BreadCrumbsComp = () => {
  const url = new URL(window.location.href).pathname;
  const arr = url.split("/");
  let homeURL = "";
  arr.shift();
  // console.log(arr);
  // console.log(arr.length);

  return (
    <Box>
      <Breadcrumb spacing="8px" separator={<CgChevronRight color={"white"} />}>
        <BreadcrumbItem>
          <Image h={"1rem"} src={icon} />
        </BreadcrumbItem>
        <BreadcrumbItem>
          {arr.length > 1 ? (homeURL = "/") : (homeURL = "#")}
          <BreadcrumbLink href={homeURL} color={"white"}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {arr.length > 1
          ? arr.map((path, index) => {
              return (
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink href={`/${path}`} color={"white"}>
                    {path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              );
            })
          : void 0}
      </Breadcrumb>
    </Box>
  );
};
