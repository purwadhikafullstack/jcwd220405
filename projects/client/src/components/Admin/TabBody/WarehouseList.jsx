// react
import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";

// chakra
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Center,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Stack,
  Skeleton,
  Text,
} from "@chakra-ui/react";

// icons
import { BiSearch } from "react-icons/bi";
import { BsFillTrashFill, BsArrowUp, BsArrowDown } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { RxReload } from "react-icons/rx";

// props
import { AddWarehouse } from "./WarehouseProps/AddWarehouse";
import { EditWarehouse } from "./WarehouseProps/EditWarehouse";

export const WarehouseList = () => {
  const url = process.env.REACT_APP_API_BASE_URL + "/admin/";

  const [warehouse, setWarehouse] = useState();
  const [admin, setAdmin] = useState();
  const [sort, setSort] = useState();
  const [direction, setDirection] = useState();
  const [pagination, setPagination] = useState(0);
  const [pages, setPages] = useState();
  const [search, setSearch] = useState(``);

  const searchValue = useRef(``);

  const getWarehouse = useCallback(async () => {
    try {
      const warehouseURL =
        search === ``
          ? url + "all_warehouse?"
          : url + `filter_warehouse?search=${search}&`;
      const sortURL = sort ? warehouseURL + `sort=${sort}&` : warehouseURL;
      const directionURL = direction
        ? sortURL + `direction=${direction}&`
        : sortURL;
      const paginationURL = pagination
        ? directionURL + `pagination=${pagination}`
        : directionURL;
      const resultWarehouse = await Axios.get(paginationURL);
      setWarehouse(resultWarehouse.data.result);
      setPages(resultWarehouse.data.pages);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (err) {
      console.log(err);
    }
  }, [sort, direction, pagination, search, url]);

  const getAdmin = useCallback(async () => {
    try {
      const resultAdmin = await Axios.get(url + "warehouse_admin");
      setAdmin(resultAdmin.data);
    } catch (err) {
      console.log(err);
    }
  }, [url]);

  const deleteWarehouse = async (id) => {
    try {
      await Axios.delete(url + `delete_warehouse/${id}`);
      getWarehouse();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWarehouse();
    getAdmin();
  }, [getWarehouse, getAdmin]);

  const tableHead = [
    { name: "Id", origin: "id", width: "100px" },
    { name: "Warehouse Name", origin: "warehouse_name", width: "" },
    { name: "Province", origin: "province", width: "250px" },
    { name: "City", origin: "city", width: "150px" },
    { name: "Postal Code", origin: "postal_code", width: "150px" },
    { name: "Admin Id", origin: "UserId", width: "50px" },
  ];

  return (
    <Box padding={{ base: "10px", lg: "0" }}>
      <Center paddingBottom={"12px"}>
        <Stack>
          <Flex>
            <Box paddingRight={"12px"}>
              <InputGroup w={{ base: "200px", lg: "400px" }}>
                <Input
                  placeholder={"Search"}
                  _focusVisible={{ border: "1px solid #b759b4" }}
                  ref={searchValue}
                />
                <InputRightElement>
                  <IconButton
                    type={"submit"}
                    aria-label="Search database"
                    bg={"none"}
                    opacity={"50%"}
                    _hover={{ bg: "none", opacity: "100%" }}
                    icon={<BiSearch />}
                    onClick={() => {
                      setSearch(searchValue.current.value);
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
            <IconButton
              icon={<RxReload />}
              onClick={() => {
                getWarehouse();
              }}
            />
          </Flex>
          <Center>
            <AddWarehouse getWarehouse={getWarehouse} admin={admin} />
          </Center>
        </Stack>
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
                    width={item.width}
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
              <Th
                bg={"#b759b4"}
                textAlign={"center"}
                color={"white"}
                width={"200px"}
                borderY={"none"}
              >
                Action
              </Th>
            </Tr>
          </Thead>
          {warehouse ? (
            warehouse?.map((item, index) => {
              return (
                <Tbody key={index} bg={"#efdbef"} _hover={{ bg: "#e9cde8" }}>
                  <Tr>
                    <Td textAlign={"center"}>{item.id}</Td>
                    <Td>{item.warehouse_name}</Td>
                    <Td textAlign={"center"}>{item.province}</Td>
                    <Td textAlign={"center"}>{item.city}</Td>
                    <Td textAlign={"center"}>{item.postal_code}</Td>
                    <Td textAlign={"center"}>{item.UserId}</Td>
                    <Td>
                      <Flex
                        gap={"20px"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <EditWarehouse
                          warehouse={item}
                          admin={admin}
                          getWarehouse={getWarehouse}
                        />
                        <IconButton
                          onClick={() => {
                            deleteWarehouse(item.id);
                          }}
                          bg={"none"}
                          color={"#ff4d4d"}
                          icon={<BsFillTrashFill />}
                        />
                      </Flex>
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
                <Td>
                  <Skeleton h={"10px"} />
                </Td>
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
