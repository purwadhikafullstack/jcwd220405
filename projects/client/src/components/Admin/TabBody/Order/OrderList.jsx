import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { OrderListCard } from "./OrderListCard";

import { Box, Select, useToast } from "@chakra-ui/react";
import { OrderListPagination } from "./OrderListPagination";
import swal from "sweetalert";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const OrderList = () => {
  const { id, role } = useSelector((state) => state.userSlice.value);
  const [orderList, setOrderList] = useState([]);
  const [wrList, setWrList] = useState([]);
  const [wrId, setWrId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const toast = useToast();

  const getOrderList = useCallback(async () => {
    try {
      const response = await (
        await axios.post(`${baseApi}/admin/order-list/${id}?page=${page - 1}`, {
          wrId,
          role,
        })
      ).data;
      setOrderList(response.result);
      setTotalPage(response.totalPage);
    } catch (error) {
      console.error(error);
    }
  }, [wrId, id, role, page]);

  const rejectOrder = async (order, status) => {
    try {
      const once = await swal("Reject this order?", {
        dangerMode: true,
        buttons: true,
      });
      if (once) {
        await axios.post(
          `${baseApi}/admin/order-cancel/${order}?status=${status}`
        );
        setTimeout(
          () =>
            toast({
              title: `Success Reject Order`,
              // variant: "solid",
              status: "success",
              isClosable: true,
              position: "top",
            }),
          500
        );
        setTimeout(() => getOrderList(), 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const confirmOrder = async (order) => {
    try {
      const once = await swal("Confirm this order?", {
        dangerMode: true,
        buttons: true,
      });
      if (once) {
        const temp = await axios.post(
          `${baseApi}/admin/order-confirm/${order}`
        );
        setTimeout(
          () =>
            toast({
              title: `${temp.data.message}`,
              variant: "subtle",
              isClosable: true,
              position: "top",
            }),
          500
        );
        setTimeout(() => getOrderList(), 1000);
        console.log(temp);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const warehouseList = useCallback(async () => {
    try {
      const response = await (
        await axios.get(`${baseApi}/admin/warehouse-list`)
      ).data;
      setWrList(response.result);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderWarehouse = () => {
    return wrList.map((item, index) => {
      return (
        <option value={item.id} key={index}>
          {item.warehouse_name}
        </option>
      );
    });
  };

  useEffect(() => {
    getOrderList();
    warehouseList();
  }, [getOrderList, warehouseList]);

  const crossTitle = (str, start, end) => {
    if (str?.length > end) {
      return str.slice(start, end) + "...";
    }
    return str;
  };

  return (
    <Box pb={"4"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>Order List</Box>
        <Box hidden={role === "3" ? false : true}>
          <Select
            placeholder={wrId ? "Reset" : "--Select Warehouse--"}
            onChange={(e) => {
              setWrId(e.target.value);
              setPage(1);
            }}
          >
            {renderWarehouse()}
          </Select>
        </Box>
      </Box>
      <Box>
        <OrderListCard
          orderList={orderList}
          crossTitle={crossTitle}
          rejectOrder={rejectOrder}
          confirmOrder={confirmOrder}
        />
      </Box>
      <Box
        p={"4"}
        hidden={role < 3 ? true : false || orderList?.length ? false : true}
      >
        <OrderListPagination
          page={page}
          setPage={setPage}
          totalPage={totalPage}
        />
      </Box>
    </Box>
  );
};
