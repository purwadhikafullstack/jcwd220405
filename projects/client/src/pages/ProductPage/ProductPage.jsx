import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@chakra-ui/react";

import { NavbarComp } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { Product } from "../../components/Product/Product";

export const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pmax, setPmax] = useState("");
  const [pmin, setPmin] = useState("");
  const [valueMax, setValueMax] = useState("");
  const [valueMin, setValueMin] = useState("");
  const [page, setPage] = useState(1);

  function setPrice() {
    setPmax(valueMax);
    setPmin(valueMin);
    setPage(1);
  }
  return (
    <>
      <NavbarComp
        searchquery={searchParams.get("search_query")}
        setSearchParams={setSearchParams}
        setPage={setPage}
        setPmax={setPmax}
        setPmin={setPmin}
      />
      <Container
        maxW="full"
        color={"white"}
        pt={"5"}
        pb={"5"}
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
        mb={"20"}
      >
        <Product
          search={searchParams.get("search_query")}
          page={page}
          setPage={setPage}
          pmax={pmax}
          pmin={pmin}
          setPrice={setPrice}
          valueMax={valueMax}
          setValueMax={setValueMax}
          valueMin={valueMin}
          setValueMin={setValueMin}
        />
      </Container>
      <Footer />
    </>
  );
};
