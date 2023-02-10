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
  Button,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BiSearch } from "react-icons/bi";
import { BsFillTrashFill, BsArrowUp, BsArrowDown } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { RxReload } from "react-icons/rx";

// Props
import { AddCategory } from "./CategoryProps/AddCategory";
import { EditCategory } from "./CategoryProps/EditCategory";

export const CategoryList = () => {
  const url = process.env.REACT_APP_API_BASE_URL + "/admin/";
  const token = localStorage.getItem("token");

  const { role } = useSelector((state) => state.userSlice.value);

  const [category, setCategory] = useState();
  const [sort, setSort] = useState("id");
  const [direction, setDirection] = useState("ASC");
  const [pagination, setPagination] = useState(0);
  const [pages, setPages] = useState();
  const [search, setSearch] = useState(``);

  const searchValue = useRef(``);

  const getCategory = useCallback(async () => {
    try {
      const productURL =
        url +
        `all_category?search=${search}&sort=${sort}&direction=${direction}&pagination=${pagination}`;

      const result = await Axios.get(productURL, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setCategory(result.data.result);
      setPages(result.data.pages);

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (err) {}
  }, [url, direction, pagination, search, sort, token]);

  const deleteCategory = async (id) => {
    try {
      await Axios.delete(url + `delete_category/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      getCategory();
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
          deleteCategory(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
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
    getCategory();
  }, [getCategory]);

  const tableHead = [
    { name: "Id", origin: "Id", width: "100px" },
    { name: "Category", origin: "category", width: "" },
  ];

  return (
    <Box>
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
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
            <IconButton
              icon={<RxReload />}
              onClick={() => {
                getCategory();
              }}
            />
          </Flex>
          {role === 3 ? (
            <Center>
              <AddCategory getCategory={getCategory} />
            </Center>
          ) : null}
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
              {role === 3 ? (
                <Th
                  bg={"#b759b4"}
                  textAlign={"center"}
                  color={"white"}
                  w={"200px"}
                  borderY={"none"}
                >
                  Action
                </Th>
              ) : null}
            </Tr>
          </Thead>
          {category ? (
            category.map((item, index) => {
              return (
                <Tbody key={index} bg={"#efdbef"} _hover={{ bg: "#e9cde8" }}>
                  <Tr>
                    <Td textAlign={"center"}>{item.id}</Td>
                    <Td>{item.category}</Td>
                    {role === 3 ? (
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
                    ) : null}
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
                {role === 3 ? (
                  <Td>
                    <Skeleton h={"10px"} />
                  </Td>
                ) : null}
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
