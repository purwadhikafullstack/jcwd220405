import { Box, Button, Text } from "@chakra-ui/react";

export const PaginationProduct = ({ page, setPage, totalPage }) => {
  function toUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <>
      <Box display="flex" justifyContent="center" alignContent="center" gap={3}>
        <Button
          onClick={() => {
            setPage(page - 1);
            toUp();
          }}
          disabled={page === 1 ? true : false}
          size={{ base: "sm", md: "md" }}
          borderColor="rgb(213, 75, 121)"
          borderRadius=".6em"
          borderWidth="2px"
          bgColor="inherit"
          _hover={{ bg: "rgb(213, 75, 121)" }}
          _active={{ bg: "none" }}
        >
          {"Prev"}
        </Button>
        <Text alignSelf="center">
          {" "}
          {page} of {totalPage}
        </Text>
        <Button
          onClick={() => {
            setPage(page + 1);
            toUp();
          }}
          disabled={page === totalPage ? true : false}
          size={{ base: "sm", md: "md" }}
          borderColor="rgb(213, 75, 121)"
          borderRadius=".6em"
          borderWidth="2px"
          bgColor="inherit"
          _hover={{ bg: "rgb(213, 75, 121)" }}
          _active={{ bg: "none" }}
        >
          {"Next"}
        </Button>
      </Box>
    </>
  );
};
