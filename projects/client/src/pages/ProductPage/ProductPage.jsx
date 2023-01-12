import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@chakra-ui/react";

import { NavbarComp } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { Product } from "../../components/Product/Product";
import { FilterProduct } from "../../components/Product/FilterProduct";

export const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [pmax, setPmax] = useState("");
  const [pmin, setPmin] = useState("");
  const [valueMax, setValueMax] = useState("");
  const [valueMin, setValueMin] = useState("");
  const [page, setPage] = useState(1);
  const [click, setClick] = useState(0);

  function setPrice() {
    setPmax(valueMax);
    setPmin(valueMin);
  }
  return (
    <>
      <NavbarComp
        searchquery={searchParams.get("search_query")}
        setSearchParams={setSearchParams}
        setSearch={setSearch}
        setPage={setPage}
        setPmax={setPmax}
        setPmin={setPmin}
        setClick={setClick}
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
        <FilterProduct
          setPrice={setPrice}
          valueMax={valueMax}
          setValueMax={setValueMax}
          valueMin={valueMin}
          setValueMin={setValueMin}
          click={click}
          setClick={setClick}
        />
        <Product
          search={searchParams.get("search_query")}
          page={page}
          setPage={setPage}
          pmax={pmax}
          pmin={pmin}
        />
      </Container>
      <Footer />
    </>
  );
};
