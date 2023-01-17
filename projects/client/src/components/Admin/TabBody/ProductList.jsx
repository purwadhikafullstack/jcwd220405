// react
import Axios from "axios";
import { useEffect, useState, useCallback } from "react";

// chakra
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Box,
} from "@chakra-ui/react";

// props
import { AddProduct } from "./ProductProps/AddProduct";

export const ProductList = () => {
  const url = "http://localhost:8000/api/admin/";

  const [products, setProducts] = useState();
  const [category, setCategory] = useState();

  const getProducts = useCallback(async () => {
    try {
      const result = await Axios.get(url + "all_products");
      const categoryResult = await Axios.get(url + "all_category")
      setProducts(result.data);
      setCategory(categoryResult.data)
    } catch (err) {
      console.log(err);
    }
  }, []);

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
    { name: "Id", origin: "id" },
    { name: "Name", origin: "name" },
    { name: "Desc", origin: "desc" },
    { name: "Price", origin: "price" },
    { name: "Weight", origin: "weight" },
    { name: "Category", origin: "ProductCategoryId" },
  ];

  return (
    <Box>
      <AddProduct getProducts={getProducts} category={category} />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {tableHead.map((item, index) => {
                return (
                  <Th
                    key={index}
                    border={"1px solid black"}
                    // onClick={() => {
                    //   setSort(item.origin);
                    //   setPagination(0);
                    //   setPage(0);
                    // }}
                  >
                    {item.name}
                  </Th>
                );
              })}
              <Th textAlign={"center"} border={"1px solid black"}>
                Action
              </Th>
            </Tr>
          </Thead>
          {products?.map((item, index) => {
            return (
              <Tbody key={index}>
                <Tr>
                  <Td w={"50px"}>{item.id}</Td>
                  <Td maxW={"300px"} whiteSpace={"pre-wrap"}>
                    {item.name}
                  </Td>
                  <Td maxW={"300px"} whiteSpace={"pre-wrap"}>
                    {item.desc}
                  </Td>
                  <Td>{item.price}</Td>
                  <Td>{item.weight}</Td>
                  <Td>{item.Product_Category.category}</Td>
                  <Td>
                    <Flex
                      gap={"20px"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {/* <EditModal user={item} setReload={setReload} /> */}
                      <Button
                        onClick={() => {
                          deleteProduct(item.id);
                        }}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              </Tbody>
            );
          })}
        </Table>
      </TableContainer>
    </Box>
  );
};
