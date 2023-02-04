import { Box, Text } from "@chakra-ui/react";

export const TextShow = ({
  offset,
  page,
  totalPage,
  totalRows,
  limit,
  search,
}) => {
  return (
    <>
      <Box w={{ base: "100%", md: "auto" }}>
        <Text>
          Showing {offset ? offset + 1 : "1"} -{" "}
          {page === totalPage ? totalRows : limit * page} items from a total of{" "}
          {totalRows ? totalRows : ""} for "{search ? search : ""}"
        </Text>
      </Box>
    </>
  );
};
