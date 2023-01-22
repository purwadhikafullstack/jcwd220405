// chakra
import { Box } from "@chakra-ui/react";

// components
import { UserList } from "./TabBody/UserList";
import { WarehouseList } from "./TabBody/WarehouseList";
import { ProductList } from "./TabBody/ProductList";
import { ReportList } from "./TabBody/ReportList";
import { CategoryList } from "./TabBody/CategoryList";

export const AdminBody = ({ tabNum, role }) => {
  const tabs =
    role === 3
      ? [UserList, WarehouseList, ProductList, CategoryList, ReportList]
      : [ProductList, CategoryList, ReportList];
  const TabBody = tabs[tabNum];

  return (
    <Box
      paddingLeft={{ base: 1, md: 64 }}
      paddingRight={{ md: 4 }}
      paddingTop={{ md: 3 }}
    >
      <TabBody />
    </Box>
  );
};
