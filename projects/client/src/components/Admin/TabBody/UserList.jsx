// react
import Axios from "axios";
import { useCallback, useEffect, useState } from "react";

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
} from "@chakra-ui/react";

// props
import { EditUser } from "./UserProps/EditUser";

export const UserList = () => {
  const url = "http://localhost:8000/api/admin/";

  const [users, setUsers] = useState();
  const [reload, setReload] = useState();
  const [sort, setSort] = useState();
  const [direction, setDirection] = useState();
  const [pagination, setPagination] = useState(0);
  const [page, setPage] = useState(1);

  const getUsers = useCallback(async () => {
    try {
      const userURL = url + "all_user?";
      const sortURL = sort ? userURL + `sort=${sort}&` : userURL;
      const directionURL = direction
        ? sortURL + `direction=${direction}&`
        : sortURL;
      const paginationURL = pagination
        ? directionURL + `pagination=${pagination}`
        : directionURL;
      const resultUsers = await Axios.get(paginationURL);
      setUsers(resultUsers.data);
      // console.log(paginationURL);
      setReload(false);
    } catch (err) {
      console.log(err);
    }
  }, [sort, pagination, direction]);

  const deleteUser = async (id) => {
    try {
      await Axios.delete(url + `delete_user/${id}`);
      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const tableHead = [
    { name: "Id", origin: "id" },
    { name: "Email", origin: "email" },
    { name: "Name", origin: "name" },
    { name: "Role", origin: "role" },
  ];

  return (
    <Box>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {tableHead.map((item, index) => {
                return (
                  <Th
                    key={index}
                    border={"1px solid black"}
                    onClick={() => {
                      setSort(item.origin);
                      setPagination(0);
                      setPage(0);
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
          {users?.map((item, index) => {
            return (
              <Tbody key={index}>
                <Tr>
                  <Td width={"50px"}>{item.id}</Td>
                  <Td>{item.email}</Td>
                  <Td>{item.name}</Td>
                  <Td width={"50px"}>{item.role}</Td>
                  <Td>
                    <Flex
                      gap={"20px"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <EditUser user={item} setReload={setReload} />
                      <Button
                        onClick={() => {
                          deleteUser(item.id);
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
        {users?.length === 10 ? (
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
