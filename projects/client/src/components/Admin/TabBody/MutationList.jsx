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
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { RxReload } from "react-icons/rx";
import { RxCheck, RxCross1 } from "react-icons/rx";
import { BiSearch } from "react-icons/bi";

// props
import { AddMutation } from "./MutationProps/AddMutation";

export const MutationList = () => {
  const url = process.env.REACT_APP_API_BASE_URL + "/admin/";
  const token = localStorage.getItem("token");

  const { id, role } = useSelector((state) => state.userSlice.value);

  const [mutations, setMutations] = useState();
  const [warehouses, setWarehouses] = useState();
  const [warehouseId, setWarehouseId] = useState();
  const [products, setProducts] = useState();
  const [sort, setSort] = useState("id");
  const [direction, setDirection] = useState("DESC");
  const [pagination, setPagination] = useState(0);
  const [pages, setPages] = useState();
  const [search, setSearch] = useState(``);

  const searchValue = useRef(``);

  const getMutations = useCallback(async () => {
    try {
      const mutationsURL =
        url +
        `all_mutations?search=${search}&role=${role}&userId=${id}&sort=${sort}&direction=${direction}&pagination=${pagination}`;

      const resultMutation = await Axios.get(mutationsURL, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setMutations(resultMutation.data.result);
      setPages(resultMutation.data.pages);
      setWarehouses(resultMutation.data.allWarehouse);
      setProducts(resultMutation.data.allProducts);
      setWarehouseId(resultMutation.data.warehouse);

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (err) {
      console.log(err);
    }
  }, [url, id, role, sort, direction, pagination, search, token]);

  const approvalFunc = useCallback(
    async (
      ItemId,
      WarehouseIdTo,
      WarehouseIdFrom,
      ProductId,
      approvalValue
    ) => {
      try {
        await Axios.patch(
          url +
            `approval_mutation/${ItemId}?WarehouseIdTo=${WarehouseIdTo}&WarehouseIdFrom=${WarehouseIdFrom}&ProductId=${ProductId}`,
          { approval: approvalValue },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        getMutations();
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.name
            ? err.response.data.errors[0].message.toUpperCase()
            : err.response.data.toUpperCase(),
        });
      }
    },
    [url, getMutations, token]
  );

  const approvalWarning = async (
    ItemId,
    WarehouseIdTo,
    WarehouseIdFrom,
    ProductId,
    approvalValue
  ) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, accept request!",
      }).then((result) => {
        if (result.isConfirmed) {
          approvalFunc(
            ItemId,
            WarehouseIdTo,
            WarehouseIdFrom,
            ProductId,
            approvalValue
          );
          Swal.fire("Success!", "Mutation Updated", "success");
        }
      });
    } catch (err) {
      console.log(err);
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
    getMutations();
  }, [getMutations]);

  const tableHead = [
    { name: "Id", origin: "id", width: "50px" },
    { name: "Request Warehouse", origin: "IdWarehouseTo", width: "100px" },
    { name: "Response Warehouse", origin: "IdWarehouseFrom", width: "100px" },
    { name: "Product Id", origin: "ProductId", width: "150px" },
    { name: "Quantity", origin: "quantity", width: "150px" },
    { name: "Approval", origin: "approval", width: "200px" },
    { name: "Invoice", origin: "invoice", width: "150px" },
    { name: "Time", origin: "createdAt", width: "150px" },
  ];

  return (
    <Box padding={{ base: "10px", lg: "0" }}>
      <Center paddingBottom={"12px"}>
        <Stack>
          <Flex>
            <Box paddingRight={"5px"}>
              <InputGroup w={{ base: "200px", lg: "400px" }}>
                <Input
                  placeholder={"Search Invoice"}
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
                setSort("id");
                setPagination(0);
                setDirection("DESC");
                getMutations();
              }}
            />
          </Flex>
          <Center>
            <AddMutation
              warehouses={warehouses}
              products={products}
              warehouseId={warehouseId}
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
          {mutations ? (
            mutations?.map((item, index) => {
              let approval;

              if (item.approval === null) {
                approval = <Td textAlign={"center"}>Request</Td>;
              } else if (item.approval === false) {
                approval = (
                  <Td textAlign={"center"} color={"red"}>
                    Denied
                  </Td>
                );
              } else if (item.approval === true) {
                approval = (
                  <Td textAlign={"center"} color={"green"}>
                    Accepted
                  </Td>
                );
              }

              return (
                <Tbody key={index} bg={"#efdbef"} _hover={{ bg: "#e9cde8" }}>
                  <Tr>
                    <Td textAlign={"center"}>{item.id}</Td>
                    <Td textAlign={"center"}>{item.IdWarehouseTo}</Td>
                    <Td textAlign={"center"}>{item.IdWarehouseFrom}</Td>
                    <Td textAlign={"center"}>{item.ProductId}</Td>
                    <Td textAlign={"center"}>{item.quantity}</Td>
                    {approval}
                    <Td textAlign={"center"}>{item.invoice}</Td>
                    <Td textAlign={"center"}>
                      <Stack>
                        <Text>{item.createdAt.slice(0, 10)}</Text>
                        <Text>{item.createdAt.slice(11, 19)}</Text>
                      </Stack>
                    </Td>
                    <Td>
                      {item.approval === null ? (
                        <Flex
                          gap={"20px"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <IconButton
                            onClick={() => {
                              approvalWarning(
                                item.id,
                                item.IdWarehouseTo,
                                item.IdWarehouseFrom,
                                item.ProductId,
                                1
                              );
                            }}
                            bg={"none"}
                            fontSize={"3xl"}
                            color={"green"}
                            icon={<RxCheck />}
                          />
                          <IconButton
                            onClick={() => {
                              approvalWarning(
                                item.id,
                                item.IdWarehouseTo,
                                item.IdWarehouseFrom,
                                item.ProductId,
                                0
                              );
                            }}
                            bg={"none"}
                            fontSize={"xl"}
                            color={"#ff4d4d"}
                            icon={<RxCross1 />}
                          />
                        </Flex>
                      ) : null}
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
