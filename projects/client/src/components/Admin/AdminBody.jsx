// chakra
import {
  Box,
} from "@chakra-ui/react";

// components
import { UserList } from "./TabBody/UserList";
import { WarehouseList } from "./TabBody/WarehouseList";
import { ItemList } from "./TabBody/ItemList";
import { ReportList } from "./TabBody/ReportList";

export const AdminBody = ({ tabNum }) => {
  const tabs = [UserList, WarehouseList, ItemList, ReportList];
  const TabBody = tabs[tabNum];
  // console.log(tabNum);

  return (
    <Box paddingLeft={{ base: 1, md: 64 }} paddingRight={{ md: 4}} paddingTop={{ md: 3 }}>
      <TabBody />
    </Box>
  );
};
