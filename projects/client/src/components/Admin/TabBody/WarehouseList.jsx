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

// swal
import Swal from "sweetalert2";

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
  const token = localStorage.getItem("token");

  const [warehouse, setWarehouse] = useState();
  const [admin, setAdmin] = useState();
  const [provinces, setProvinces] = useState();
  const [products, setProducts] = useState();
  const [sort, setSort] = useState("id");
  const [direction, setDirection] = useState("ASC");
  const [pagination, setPagination] = useState(0);
  const [pages, setPages] = useState();
  const [search, setSearch] = useState(``);

  const searchValue = useRef(``);

  const getWarehouse = useCallback(async () => {
    try {
      const warehouseURL =
        url +
        `all_warehouse?search=${search}&sort=${sort}&direction=${direction}&pagination=${pagination}`;
      const resultWarehouse = await Axios.get(warehouseURL, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setWarehouse(resultWarehouse.data.result);
      setPages(resultWarehouse.data.pages);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (err) {}
  }, [sort, direction, pagination, search, url, token]);

  const getProvince = async () => {
    try {
      const resultProvinces = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + "/province"
      );
      setProvinces(resultProvinces.data.result);
    } catch (err) {}
  };

  const getProducts = useCallback(async () => {
    try {
      const resultProduct = await Axios.get(url + `all_products?search=`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setProducts(resultProduct.data.raw);
    } catch (err) {}
  }, [url, token]);

  const getAdmin = useCallback(async () => {
    try {
      const resultAdmin = await Axios.get(url + "warehouse_admin", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setAdmin(resultAdmin.data);
    } catch (err) {}
  }, [url, token]);

  const deleteWarehouse = async (id) => {
    try {
      await Axios.delete(url + `delete_warehouse/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      await Axios.delete(url + `delete_mutation?IdWarehouseTo=${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      getWarehouse();
    } catch (err) {}
  };

  const deleteWarning = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteWarehouse(id);
          Swal.fire("Deleted!", "Warehouse deleted.", "success");
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.name
          ? err.response.data.errors[0].message.toUpperCase()
          : err.response.data.toUpperCase(),
      });
    }
  };

  useEffect(() => {
    getWarehouse();
    getAdmin();
    getProvince();
    getProducts();
  }, [getWarehouse, getAdmin, getProducts]);

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
      <Center paddingBottom={"5px"}>
        <Stack>
          <Flex>
            <Box paddingRight={"5px"}>
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
            <AddWarehouse
              getWarehouse={getWarehouse}
              provinces={provinces}
              admin={admin}
              products={products}
            />
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
                          provinces={provinces}
                        />
                        <IconButton
                          onClick={() => {
                            deleteWarning(item.id);
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
