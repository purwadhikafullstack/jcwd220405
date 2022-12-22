// chakra
import { Grid, GridItem, Box, IconButton } from "@chakra-ui/react";

// icon
import { CgShoppingCart, CgHeart } from "react-icons/cg";

export const NavBottomMobile = () => {
  return (
    <Box
      bg={"#351734"}
      display={{ md: "none" }}
      pos={"fixed"}
      bottom={0}
      w={"100%"}
    >
      <Grid templateColumns={"repeat(2, auto)"}>
        <GridItem borderRight={"1px solid white"}>
          <IconButton
            icon={<CgShoppingCart />}
            w={"100%"}
            onClick={() => console.log("hey")}
            bg={"none"}
            borderRadius={0}
            color={"white"}
            fontSize={"3xl"}
          />
        </GridItem>
        <GridItem>
          <IconButton
            icon={<CgHeart />}
            w={"100%"}
            onClick={() => console.log("hey")}
            bg={"none"}
            borderRadius={0}
            color={"white"}
            fontSize={"3xl"}
          />
        </GridItem>
      </Grid>
    </Box>
  );
};
