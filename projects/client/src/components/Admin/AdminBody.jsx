// chakra
import { Box } from "@chakra-ui/react";

// components
import { UserList } from "./TabBody/UserList";
import { WarehouseList } from "./TabBody/WarehouseList";
import { ProductList } from "./TabBody/ProductList";
import { ReportList } from "./TabBody/ReportList";
import { CategoryList } from "./TabBody/CategoryList";
import { OrderList } from "./TabBody/Order/OrderList";
import { MutationList } from "./TabBody/MutationList";
import { SalesList } from "./TabBody/SalesList";

export const AdminBody = ({ tabNum }) => {
  const tabs = [
    UserList,
    WarehouseList,
    ProductList,
    CategoryList,
    OrderList,
    MutationList,
    ReportList,
    SalesList,
  ];
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
