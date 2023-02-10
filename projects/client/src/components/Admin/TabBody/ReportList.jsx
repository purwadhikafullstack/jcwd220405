// react
import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";

// chakra
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Box,
  Center,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Stack,
  Skeleton,
  Text,
  Select,
} from "@chakra-ui/react";

// icons
import { BiSearch } from "react-icons/bi";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { RxReload } from "react-icons/rx";

export const ReportList = () => {
  const url = process.env.REACT_APP_API_BASE_URL + "/admin/";
  const token = localStorage.getItem("token");

  const { id, role } = useSelector((state) => state.userSlice.value);

  const [journals, setJournals] = useState();
  const [warehouses, setWarehouses] = useState();
  const [warehouse, setWarehouse] = useState("");
  const [sort, setSort] = useState("id");
  const [direction, setDirection] = useState("DESC");
  const [pagination, setPagination] = useState(0);
  const [pages, setPages] = useState();

  const warehouseValue = useRef(``);

  const getJournals = useCallback(async () => {
    try {
      const journalURL =
        role === 3
          ? url +
            `all_journal?WarehouseId=${warehouse}&sort=${sort}&direction=${direction}&pagination=${pagination}`
          : url +
            `warehouse_journal?UserId=${id}&sort=${sort}&direction=${direction}&pagination=${pagination}`;

      const resultJournal = await Axios.get(journalURL, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const resultWarehouse = await Axios.get(url + "all_warehouse?search=", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setWarehouses(resultWarehouse.data.result);
      setJournals(resultJournal.data.result);
      setPages(resultJournal.data.pages);

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (err) {}
  }, [url, sort, direction, pagination, warehouse, id, role, token]);

  useEffect(() => {
    getJournals();
  }, [getJournals]);

  const tableHead = [
    { name: "ID", origin: "id", width: "100px" },
    { name: "Product ID", origin: "ProductId", width: "50px" },
    { name: "Stock Before", origin: "stock_before", width: "100px" },
    { name: "Stock After", origin: "stock_after", width: "100px" },
    { name: "Warehouse ID", origin: "WarehouseId", width: "100px" },
    { name: "Desc", origin: "desc", width: "200px" },
    {
      name: "Type",
      origin: "JournalTypeId.Journal_Type?.append",
      width: "100px",
    },
    { name: "Stock Mutation ID", origin: "StockMutationId", width: "100px" },
    { name: "Transaction ID", origin: "TransactionId", width: "100px" },
    { name: "Time", origin: "createdAt", width: "100px" },
  ];

  return (
    <Box padding={{ base: "10px", lg: "0" }}>
      <Center paddingBottom={"12px"}>
        <Flex>
          <Box paddingRight={"5px"}>
            {role === 3 ? (
              <Center>
                <Select
                  ref={warehouseValue}
                  onChange={() => {
                    setWarehouse(warehouseValue.current.value);
                    setSort("id");
                    setPagination(0);
                    setDirection("ASC");
                  }}
                  paddingLeft={"5px"}
                >
                  <option value={""}>All Warehouse</option>
                  {warehouses?.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>
                        {item.warehouse_name}
                      </option>
                    );
                  })}
                </Select>
              </Center>
            ) : null}
          </Box>
          <IconButton
            icon={<RxReload />}
            onClick={() => {
              setSort("id");
              setPagination(0);
              setDirection("DESC");
            }}
          />
        </Flex>
      </Center>
      <TableContainer borderRadius={"10px"}>
        <Table>
          <Thead>
            <Tr>
              {tableHead.map((item, index) => {
                return (
                  <Th
                    key={index}
                    bg={"#b759b4"}
                    textAlign={"center"}
                    color={"white"}
                    w={item.width}
                    borderY={"none"}
                  >
                    <Center>
                      <Flex gap={"5px"}>
                        <Center>{item.name}</Center>
                        <Stack>
                          <IconButton
                            icon={<BsArrowUp />}
                            size={"xs"}
                            color={"black"}
                            onClick={() => {
                              setSort(item.origin);
                              setPagination(0);
                              setDirection("ASC");
                            }}
                            bg={"none"}
                          />
                          <IconButton
                            icon={<BsArrowDown />}
                            size={"xs"}
                            color={"black"}
                            onClick={() => {
                              setSort(item.origin);
                              setPagination(0);
                              setDirection("DESC");
                            }}
                            bg={"none"}
                          />
                        </Stack>
                      </Flex>
                    </Center>
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          {journals ? (
            journals?.map((item, index) => {
              return (
                <Tbody key={index} bg={"#efdbef"} _hover={{ bg: "#e9cde8" }}>
                  <Tr>
                    <Td textAlign={"center"}>{item.id}</Td>
                    <Td textAlign={"center"}>{item.ProductId}</Td>
                    <Td textAlign={"center"}>{item.stock_before}</Td>
                    <Td textAlign={"center"}>{item.stock_after}</Td>
                    <Td textAlign={"center"}>{item.WarehouseId}</Td>
                    <Td textAlign={"center"}>{item.Journal_Type?.type}</Td>
                    <Td textAlign={"center"}>{item.Journal_Type?.append}</Td>
                    <Td textAlign={"center"}>
                      {item.StockMutationId ? item.StockMutationId : "-"}
                    </Td>
                    <Td textAlign={"center"}>
                      {item.TransactionId ? item.TransactionId : "-"}
                    </Td>
                    <Td textAlign={"center"}>
                      <Stack>
                        <Text>{item.createdAt.slice(0, 10)}</Text>
                        <Text>{item.createdAt.slice(11, 19)}</Text>
                      </Stack>
                    </Td>
                  </Tr>
                </Tbody>
              );
            })
          ) : (
            <Tbody>
              <Tr>
                {tableHead.map((item, index) => {
                  return (
                    <Td key={index}>
                      <Skeleton h={"10px"} />
                    </Td>
                  );
                })}
              </Tr>
            </Tbody>
          )}
        </Table>
      </TableContainer>
      <Center paddingY={"10px"}>
        {pagination <= 0 ? (
          <IconButton icon={<SlArrowLeft />} disabled />
        ) : (
          <IconButton
            onClick={() => {
              setPagination(pagination - 1);
            }}
            icon={<SlArrowLeft />}
          />
        )}
        <Text paddingX={"10px"}>
          {pagination + 1} of {pages}
        </Text>
        {pagination < pages - 1 ? (
          <IconButton
            icon={<SlArrowRight />}
            onClick={() => {
              setPagination(pagination + 1);
            }}
          />
        ) : (
          <IconButton icon={<SlArrowRight />} disabled />
        )}
      </Center>
    </Box>
  );
};
