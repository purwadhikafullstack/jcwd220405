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
  Center,
  Text,
} from "@chakra-ui/react";

// Props
import { AddCategory } from "./CategoryProps/AddCategory";
import { EditCategory } from "./CategoryProps/EditCategory";

export const CategoryList = () => {
  const url = "http://localhost:8000/api/admin/";

  const [category, setCategory] = useState();

  const getCategory = useCallback(async () => {
    try {
      const result = await Axios.get(url + "all_category");
      setCategory(result.data);

      // console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const deleteCategory = async (id) => {
    try {
      await Axios.delete(url + `delete_category/${id}`);
      getCategory();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const tableHead = [
    { name: "Id", origin: "Id" },
    { name: "Category", origin: "category" },
  ];

  return (
    <Box>
      <AddCategory getCategory={getCategory} />
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
          {category?.map((item, index) => {
            return (
              <Tbody key={index}>
                <Tr>
                  <Td w={"50px"}>{item.id}</Td>
                  <Td>{item.category}</Td>
                  <Td>
                    <Flex
                      gap={"20px"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <EditCategory
                        category={category[index]}
                        getCategory={getCategory}
                      />
                      <Button
                        onClick={() => {
                          deleteCategory(item.id);
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
