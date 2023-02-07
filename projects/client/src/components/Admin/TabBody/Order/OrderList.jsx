import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { Box, Select, Text, useMediaQuery, useToast } from "@chakra-ui/react";
import swal from "sweetalert";

import { OrderListCard } from "./OrderListCard";
import { OrderListPagination } from "./OrderListPagination";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const OrderList = () => {
  const { id, role } = useSelector((state) => state.userSlice.value);
  const [orderList, setOrderList] = useState([]);
  const [wrList, setWrList] = useState([]);
  const [wrId, setWrId] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [statusId, setStatusId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const toast = useToast();
  const [setHide] = useMediaQuery("(max-width: 780px)");

  const getOrderList = useCallback(async () => {
    try {
      const response = await (
        await axios.get(
          `${baseApi}/admin/order-list/${id}?role=${role}&wrId=${wrId}&status=${statusId}&page=${
            page - 1
          }`
        )
      ).data;
      setOrderList(response.result);
      setTotalPage(response.totalPage);
    } catch (error) {
      console.error(error);
    }
  }, [wrId, id, role, page, statusId]);

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
        const response = await axios.post(
          `${baseApi}/admin/order-confirm/${order}`
        );
        setTimeout(
          () =>
            toast({
              title: `${response.data.message}`,
              variant: "subtle",
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

  const sendOrder = async (order) => {
    try {
      const once = await swal("Send this order?", {
        dangerMode: true,
        buttons: true,
      });
      if (once) {
        const response = await axios.post(
          `${baseApi}/admin/send-order/${order}`
        );
        setTimeout(
          () =>
            toast({
              title: `${response.data.message}`,
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

  const cancelOrder = async (order) => {
    try {
      const once = await swal("Cancel this order?", {
        dangerMode: true,
        buttons: true,
      });
      if (once) {
        const response = await axios.post(
          `${baseApi}/admin/cancel-order/${order}`
        );
        setTimeout(
          () =>
            toast({
              title: `${response.data.message}`,
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

  const orderStatusList = useCallback(async () => {
    try {
      const response = await (
        await axios.get(`${baseApi}/admin/status-list`)
      ).data;
      setStatusList(response.result);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderStatus = () => {
    return statusList.map((item, index) => {
      return (
        <option value={item.id} key={index}>
          {item.status}
        </option>
      );
    });
  };

  useEffect(() => {
    getOrderList();
    warehouseList();
    orderStatusList();
  }, [getOrderList, warehouseList, orderStatusList]);

  const crossTitle = (str, start, end) => {
    if (str?.length > end) {
      return str.slice(start, end) + "...";
    }
    return str;
  };

  return (
    <Box pb={"4"} minH={"87.7vh"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box hidden={setHide ? true : false}>
          <Text>Order List</Text>
        </Box>
        <Box
          display={"flex"}
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={{ base: "", md: "flex-end" }}
          gap={"4"}
          mt={{ base: "4", md: "" }}
          w={{ base: "full", md: "400px" }}
        >
          <Box w={{ base: "full", md: "40%" }}>
            <Select
              placeholder={statusId ? "Reset" : "--Status--"}
              onChange={(e) => {
                setStatusId(e.target.value);
                setPage(1);
              }}
            >
              {renderStatus()}
            </Select>
          </Box>
          <Box hidden={role === 3 ? false : true}>
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
      </Box>
      <Box h={"68vh"} overflow={"auto"}>
        <OrderListCard
          orderList={orderList}
          crossTitle={crossTitle}
          rejectOrder={rejectOrder}
          confirmOrder={confirmOrder}
          sendOrder={sendOrder}
          cancelOrder={cancelOrder}
        />
      </Box>
      <Box p={"4"} hidden={orderList?.length ? false : true}>
        <OrderListPagination
          page={page}
          setPage={setPage}
          totalPage={totalPage}
        />
      </Box>
    </Box>
  );
};
