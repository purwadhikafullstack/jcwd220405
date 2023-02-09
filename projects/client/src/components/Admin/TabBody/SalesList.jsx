// react
import Axios from "axios";
import { useEffect, useState, useCallback } from "react";

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
  Divider,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Stack,
  Skeleton,
  Text,
  Select,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { BsFillTrashFill, BsArrowUp, BsArrowDown } from "react-icons/bs";
const baseApi = process.env.REACT_APP_API_BASE_URL;

export const SalesList = () => {
  const { id, role } = useSelector((state) => state.userSlice.value);
  const [salesList, setSalesList] = useState([]);
  const [page, sePage] = useState(1);
  const [total, Page] = useState(0);
  const [filterMonth, setFilterMonth] = useState("");

  const getSalesList = useCallback(async () => {
    try {
      const response = await (
        await Axios.get(`${baseApi}/admin/salesList?month=${filterMonth}`)
      ).data;
      // console.log(response);
      setSalesList(response);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const filterMonthBtnHandler = ({ target }) => {
    const { value } = target;
    setFilterMonth(value);
  };

  useEffect(() => {
    getSalesList();
  }, [getSalesList]);

  const tableHead = [
    { name: "invoice", origin: "invoice", width: "100px" },
    { name: "date", origin: "createdAt", width: "100px" },
    { name: "category", origin: "", width: "100px" },
    { name: "product", origin: "", width: "100px" },
    { name: "price", origin: "", width: "100px" },
    { name: "quantity", origin: "", width: "100px" },
    { name: "warehouse", origin: "", width: "100px" },
  ];

  const crossTitle = (str, start, end) => {
    if (str?.length > end) {
      return str.slice(start, end) + "...";
    }
    return str;
  };

  return (
    <>
      <Box>
        <Text fontSize="4xl" color={"black"}>
          Sales Report
        </Text>
        <Divider />
        <Box mt={4} mb={5}>
          <Select
            maxW={"30%"}
            bgColor={"white"}
            // color={"white"}
            // placeholder={statusName ? "Reset" : "--Select Transaction--"}
            onChange={
              filterMonthBtnHandler

              // setstatusName(e.target.value);
              // setPage(1);
            }
            textColor="black"
          >
            <option value="">---By Month---</option>
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </Select>
        </Box>
      </Box>

      <Box padding={{ base: "10px", lg: "0" }}>
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
                        </Flex>
                      </Center>
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            {salesList ? (
              salesList?.map((item, index) => {
                console.log(item);
                return (
                  <Tbody key={index} bg={"#efdbef"} _hover={{ bg: "#e9cde8" }}>
                    <Tr>
                      <Td textAlign={"center"}>{item.invoice}</Td>
                      <Td textAlign={"center"}>
                        {item.updatedAt.slice(0, 10)}
                      </Td>
                      <Td textAlign={"center"}>
                        {
                          item.Transaction_Product_Warehouses[0]?.Product
                            .Product_Category?.category
                        }
                      </Td>
                      <Td>
                        {item.Transaction_Product_Warehouses[0]?.Product?.name
                          .length > 50
                          ? crossTitle(
                              item.Transaction_Product_Warehouses[0]?.Product
                                ?.name,
                              0,
                              -20
                            )
                          : crossTitle(
                              item.Transaction_Product_Warehouses[0]?.Product
                                ?.name,
                              0
                            )}
                      </Td>
                      <Td>{item.Transaction_Product_Warehouses[0]?.price}</Td>
                      <Td textAlign={"center"}>
                        {item.Transaction_Product_Warehouses[0]?.quantity}
                      </Td>
                      <Td>
                        {
                          item.Transaction_Product_Warehouses[0]?.Warehouse
                            .warehouse_name
                        }
                      </Td>
                    </Tr>
                  </Tbody>
                );
              })
            ) : (
              <Tbody>
                <Tr>
                  <Td>
                    <Skeleton />
                  </Td>
                </Tr>
              </Tbody>
            )}
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
