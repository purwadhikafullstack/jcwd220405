// react
import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";

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
import { BsFillTrashFill, BsArrowUp, BsArrowDown } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { RxReload } from "react-icons/rx";

// props
import { AddProduct } from "./ProductProps/AddProduct";
import { EditProduct } from "./ProductProps/EditProduct";

export const ProductList = () => {
  const url = process.env.REACT_APP_API_BASE_URL + "/admin/";

  const [products, setProducts] = useState();
  const [category, setCategory] = useState();
  const [warehouses, setWarehouses] = useState();
  const [warehouse, setWarehouse] = useState("All Stocks");
  const [sort, setSort] = useState("id");
  const [direction, setDirection] = useState("ASC");
  const [pagination, setPagination] = useState(0);
  const [pages, setPages] = useState();
  const [search, setSearch] = useState(``);

  const searchValue = useRef(``);
  const warehouseValue = useRef(``);

  const rupiahID = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const getProducts = useCallback(async () => {
    try {
      const productURL =
        warehouse === `All Stocks`
          ? url +
            `filter_products?search=${search}&sort=${sort}&direction=${direction}&pagination=${pagination}`
          : url +
            `filter_warehouse_products?warehouse=${warehouse}&search=${search}&sort=${sort}&direction=${direction}&pagination=${pagination}`;

      const resultProducts = await Axios.get(productURL);
      const resultCategories = await Axios.get(url + "all_category");
      const resultWarehouse = await Axios.get(url + "all_warehouse");

      setProducts(resultProducts.data.result);
      setPages(resultProducts.data.pages);
      setCategory(resultCategories.data.result);
      setWarehouses(resultWarehouse.data.result);

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (err) {
      console.log(err);
    }
  }, [url, direction, pagination, search, sort, warehouse]);

  const deleteProduct = async (id) => {
    try {
      await Axios.delete(url + `delete_product/${id}`);
      getProducts();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const tableHead = [
    { name: "Id", origin: "id", width: "50px" },
    { name: "Name", origin: "name", width: "200px" },
    { name: "Desc", origin: "desc", width: "500px" },
    { name: "Price", origin: "price", width: "200px" },
    { name: "Weight", origin: "weight", width: "150px" },
    { name: "Category", origin: "ProductCategoryId", width: "150px" },
    { name: "Stocks", origin: "total_stocks", width: "150px" },
  ];

  return (
    <Box padding={{ base: "10px", lg: "0" }}>
      <Center paddingBottom={"12px"}>
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
                      setSort("id");
                      setPagination(0);
                      setDirection("ASC");
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
            <IconButton
              icon={<RxReload />}
              onClick={() => {
                setSearch("");
                setSort("id");
                setPagination(0);
                setDirection("ASC");
              }}
            />
          </Flex>
          <Center>
            <AddProduct
              warehouses={warehouses}
              getProducts={getProducts}
              category={category}
            />
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
              <option>All Stocks</option>
              {warehouses?.map((item, index) => {
                return (
                  <option value={item.id} key={index}>
                    {item.warehouse_name} Stocks
                  </option>
                );
              })}
            </Select>
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
              <Th
                bg={"#b759b4"}
                textAlign={"center"}
                color={"white"}
                w={"200px"}
                borderY={"none"}
              >
                Action
              </Th>
            </Tr>
          </Thead>
          {products ? (
            products?.map((item, index) => {
              return (
                <Tbody key={index} bg={"#efdbef"} _hover={{ bg: "#e9cde8" }}>
                  <Tr>
                    <Td>{item.id}</Td>
                    <Td whiteSpace={"pre-wrap"}>{item.name}</Td>
                    <Td whiteSpace={"pre-wrap"}>{item.desc}</Td>
                    <Td textAlign={"center"}>{rupiahID.format(item.price)}</Td>
                    <Td textAlign={"center"}>{item.weight}g</Td>
                    <Td textAlign={"center"}>
                      {item.Product_Category?.category}
                    </Td>
                    <Td textAlign={"center"}>{+item.total_stocks}</Td>
                    <Td>
                      <Flex
                        gap={"20px"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <EditProduct
                          getProducts={getProducts}
                          category={category}
                          warehouse={+warehouse}
                          item={item}
                        />
                        <IconButton
                          onClick={() => {
                            deleteProduct(item.id);
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
