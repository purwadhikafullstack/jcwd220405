// react
import Axios from "axios";
import { useEffect, useState, useCallback } from "react";

// chakra
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Center,
} from "@chakra-ui/react";

// props
import { AddWarehouse } from "./WarehouseProps/AddWarehouse";
import { EditWarehouse } from "./WarehouseProps/EditWarehouse";

export const WarehouseList = () => {
  const url = "http://localhost:8000/api/admin/";

  const [warehouse, setWarehouse] = useState();
  const [admin, setAdmin] = useState();
  const [sort, setSort] = useState();
  const [direction, setDirection] = useState();
  const [pagination, setPagination] = useState(0);
  const [page, setPage] = useState(1);

  const getWarehouse = useCallback(async () => {
    try {
      const warehouseURL = url + "all_warehouse?";
      const sortURL = sort ? warehouseURL + `sort=${sort}&` : warehouseURL;
      const directionURL = direction
        ? sortURL + `direction=${direction}&`
        : sortURL;
      const paginationURL = pagination
        ? directionURL + `pagination=${pagination}`
        : directionURL;
      const resultWarehouse = await Axios.get(paginationURL);
      setWarehouse(resultWarehouse.data);
    } catch (err) {
      console.log(err);
    }
  }, [sort, direction, pagination]);

  const getAdmin = async () => {
    try {
      const resultAdmin = await Axios.get(url + "warehouse_admin");
      setAdmin(resultAdmin.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
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
  }, [getWarehouse]);

  const tableHead = [
    { name: "Id", origin: "id" },
    { name: "Warehouse Name", origin: "warehouse_name" },
    { name: "Province", origin: "province" },
    { name: "City", origin: "city" },
    { name: "Postal Code", origin: "postal_code" },
    { name: "Admin Id", origin: "UserId" },
  ];

  return (
    <Box>
      <AddWarehouse getWarehouse={getWarehouse} admin={admin} />
      <TableContainer>
        <Table variant={"striped"}>
          <Thead>
            <Tr>
              {tableHead.map((item, index) => {
                return (
                  <Th
                    key={index}
                    textAlign={"center"}
                    border={"1px solid black"}
                    onClick={() => {
                      setSort(item.origin);
                      setPagination(0);
                      setPage(1);
                    }}
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
          {warehouse?.map((item, index) => {
            return (
              <Tbody key={index}>
                <Tr>
                  <Td width={"50px"}>{item.id}</Td>
                  <Td>{item.warehouse_name}</Td>
                  <Td width={"250px"}>{item.province}</Td>
                  <Td width={"150px"}>{item.city}</Td>
                  <Td width={"150px"}>{item.postal_code}</Td>
                  <Td width={"50px"}>{item.UserId}</Td>
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
                      <Button
                        onClick={() => {
                          deleteUser(item.id);
                        }}
                        background={"red"}
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
      <Center>
        {page > 1 ? (
          <Button
            onClick={() => {
              setPagination(pagination - 10);
              setPage(page - 1);
            }}
          >
            Previous
          </Button>
        ) : (
          <Button disabled>Previous</Button>
        )}
        {warehouse?.length === 10 ? (
          <Button
            onClick={() => {
              setPagination(pagination + 10);
              setPage(page + 1);
            }}
          >
            Next
          </Button>
        ) : (
          <Button disabled>Next</Button>
        )}
      </Center>
    </Box>
  );
};
