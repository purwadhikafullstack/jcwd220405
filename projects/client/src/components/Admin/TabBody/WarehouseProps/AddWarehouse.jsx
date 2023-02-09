// react
import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";

// validation
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";

// chakra
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Center,
  IconButton,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddWarehouse = ({ getWarehouse, admin, provinces, products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        onClick={onOpen}
        leftIcon={<CgMathPlus />}
        bg={"#7dc67f"}
        _hover={{ bg: "#abdbad" }}
      >
        New Warehouse
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Add Warehouse</ModalHeader>
          <ModalBody>
            <AddForm
              close={onClose}
              admin={admin}
              getWarehouse={getWarehouse}
              provinces={provinces}
              products={products}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close, getWarehouse, admin, provinces, products }) => {
  const url = process.env.REACT_APP_API_BASE_URL + "/admin/";

  const [cities, setCities] = useState();
  const [province, setProvince] = useState();
  const [provinceId, setProvinceId] = useState();
  const [city, setCity] = useState();
  const [cityId, setCityId] = useState();

  const UserId = useRef("");

  const validation = Yup.object().shape({
    warehouse_name: Yup.string().required("Cannot be Empty"),
    postal_code: Yup.number().required("Cannot be Empty"),
  });

  // console.log(products)

  const getCities = useCallback(async () => {
    try {
      const resultCities = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + `/city/${provinceId}`
      );
      setCities(resultCities.data.result);
    } catch (err) {
      console.log(err);
    }
  }, [provinceId]);

  const addWarehouse = async (value) => {
    try {
      const data = {
        warehouse_name: value.warehouse_name,
        province: province,
        province_id: +provinceId,
        city: city,
        city_id: +cityId,
        postal_code: value.postal_code,
        UserId: UserId.current.value,
      };

      const newWarehouse = await Axios.post(url + `add_warehouse`, data);

      await products.map(async (item) => {
        const stocks = {
          stocks: 0,
          ProductId: item.id,
          WarehouseId: newWarehouse.data.id,
        };
        return await Axios.post(url + `add_stocks`, stocks)
      })

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Warehouse Created",
      });

      getWarehouse();
      close();
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
    if (province) {
      getCities();
    }
  }, [province, getCities]);

  return (
    <Box>
      <Formik
        initialValues={{
          warehouse_name: "",
          postal_code: "",
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          addWarehouse(value);
        }}
      >
        <Form>
          <FormControl isRequired>
            <FormLabel>Warehouse Name</FormLabel>
            <Input as={Field} name={"warehouse_name"} />
            <ErrorMessage
              style={{ color: "red" }}
              component="div"
              name="warehouse_name"
            />
            <FormLabel>Province</FormLabel>
            <Select
              placeholder={"-- Select --"}
              onChange={(e) => {
                setProvinceId(e.target.value.split(",")[0]);
                setProvince(e.target.value.split(",")[1]);
              }}
            >
              {provinces?.map((item, index) => {
                return (
                  <option key={index} value={[item.province_id, item.province]}>
                    {item.province}
                  </option>
                );
              })}
            </Select>
            {cities ? (
              <>
                <FormLabel>City</FormLabel>
                <Select
                  placeholder={"-- Select --"}
                  onChange={(e) => {
                    setCityId(e.target.value.split(",")[0]);
                    setCity(e.target.value.split(",")[1]);
                  }}
                >
                  {cities?.map((item, index) => {
                    return (
                      <option
                        key={index}
                        value={[item.city_id, item.city_name]}
                      >
                        {item.city_name}
                      </option>
                    );
                  })}
                </Select>
              </>
            ) : null}
            <FormLabel>Postal Code</FormLabel>
            <Input as={Field} type={"number"} name={"postal_code"} />
            <ErrorMessage
              style={{ color: "red" }}
              component="div"
              name="postal_code"
            />
            <FormLabel>Admin Id</FormLabel>
            <Select ref={UserId}>
              {admin.map((item, index) => {
                return (
                  <option value={item.id} key={index}>
                    {item.id}
                  </option>
                );
              })}
            </Select>
            <Center paddingTop={"10px"} gap={"10px"}>
              <IconButton
                icon={<RxCheck />}
                fontSize={"3xl"}
                color={"green"}
                type={"submit"}
              />
              <IconButton
                icon={<RxCross1 />}
                fontSize={"xl"}
                color={"red"}
                onClick={close}
              />
            </Center>
          </FormControl>
        </Form>
      </Formik>
    </Box>
  );
};
