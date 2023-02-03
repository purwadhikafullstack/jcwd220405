import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Divider,
  FormHelperText,
  Checkbox,
  Text,
  Flex,
  Select,
  Textarea,
  useToast,
  Box,
} from "@chakra-ui/react";

import { useState } from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect } from "react";
import { useCallback } from "react";

export const AddAddress = ({ address, baseApi, search, id, name }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const [province, setProvince] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [status, setStatus] = useState(false);
  const handleStatus = () => setStatus(!status);

  const getProvince = useCallback(async () => {
    try {
      const response = await (await axios(`${baseApi}/province`)).data;
      setProvince(response.result);
    } catch (error) {
      console.log(error);
    }
  }, [baseApi]);

  const renderProvince = () => {
    return province?.map((item) => {
      return (
        <option
          value={[item?.province_id, item?.province]}
          key={item?.province_id}
        >
          {item?.province}
        </option>
      );
    });
  };

  const handleProvince = (value) => {
    setSelectedProvince(value?.split(","));
  };

  const getCity = useCallback(async () => {
    try {
      const response = await (
        await axios(
          `${baseApi}/city/${selectedProvince ? selectedProvince[0] : ""}`
        )
      ).data;
      setCity(response.result);
    } catch (error) {
      console.log(error);
    }
  }, [baseApi, selectedProvince]);

  const renderCity = () => {
    return city?.map((item) => {
      return (
        <option
          value={[item?.city_id, item?.city_name, item?.type]}
          key={item?.city_id}
        >
          {item?.type} {item?.city_name}
        </option>
      );
    });
  };

  const handleCity = (value) => {
    setSelectedCity(value?.split(","));
  };

  const addressValid = Yup.object().shape({
    received_name: Yup.string()
      .required("Required")
      .min(3, "Recipient Name at least 3")
      .max(50, "Recipient Name maximum 50"),
    postal_code: Yup.number()
      .required("Required")
      .positive("Incorrect Postal Code"),
    full_address: Yup.string()
      .required("Required")
      .max(200, "Address maximum 200"),
  });

  const addAddress = async (value) => {
    try {
      if (!selectedProvince?.length) {
        return toast({
          position: "top",
          title: "Select Province",
          status: "warning",
          isClosable: true,
        });
      }
      if (!selectedCity?.length) {
        return toast({
          position: "top",
          title: "Select City/Regency",
          status: "warning",
          isClosable: true,
        });
      }
      setLoading(true);

      await axios.post(`${baseApi}/address/${id}`, {
        received_name: value.received_name,
        province: selectedProvince[1],
        province_id: selectedProvince[0],
        city: selectedCity[1],
        city_id: selectedCity[0],
        city_type: selectedCity[2],
        postal_code: value.postal_code,
        full_address: value.full_address,
        status: status,
        length: address?.length,
      });
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Add Address Successfully",
            status: "success",
            isClosable: true,
          }),
        2000
      );
      setTimeout(() => setLoading(false), 2500);
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.log(error);
      toast({
        position: "top",
        title: error.response.data,
        status: "error",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getProvince();
    if (selectedProvince) {
      getCity();
    }
  }, [getProvince, getCity, selectedProvince]);
  return (
    <>
      <Box hidden={search ? true : false}>
        <Button
          bgColor={"#E73891"}
          _hover={{ opacity: ".88" }}
          onClick={onOpen}
          hidden={address?.length === 5 ? true : false}
          w={{ base: "100%", md: "" }}
        >
          + Add New Address
        </Button>
        <Text
          hidden={address?.length === 5 ? false : true}
          border={"1px"}
          textAlign={"center"}
          p={2}
          borderRadius={"md"}
        >
          Maximum Address 5
        </Text>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior={"outside"}
        size={{ base: "md", md: "2xl" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Add Address</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <Formik
            initialValues={{
              received_name: name ? name : "",
              postal_code: "",
              full_address: "",
            }}
            validationSchema={addressValid}
            onSubmit={(value) => {
              addAddress(value);
            }}
          >
            {(props) => {
              return (
                <>
                  <Form>
                    <ModalBody pb={6} mt={4}>
                      <Text as={"b"} fontSize={"20px"}>
                        Complete the address details
                      </Text>
                      <FormControl mt={4}>
                        <Flex direction={"column"}>
                          <FormLabel>Name of Recipient</FormLabel>
                          <Input
                            placeholder="Budi"
                            name="received_name"
                            as={Field}
                            maxLength="50"
                          />
                          <ErrorMessage
                            style={{ color: "orange" }}
                            component="div"
                            name="received_name"
                          />
                          <FormLabel mt={4}>Province</FormLabel>
                          <Select
                            placeholder="--Province--"
                            onChange={(e) => handleProvince(e.target.value)}
                            name="province"
                          >
                            {renderProvince()}
                          </Select>
                          <FormLabel mt={4}>City/Regency</FormLabel>
                          <Select
                            placeholder="--City--"
                            onChange={(e) => handleCity(e.target.value)}
                          >
                            {renderCity()}
                          </Select>

                          <FormLabel mt={4}>Postal Code</FormLabel>
                          <Input
                            placeholder="17610"
                            name="postal_code"
                            as={Field}
                            type="number"
                            maxLength={"5"}
                          />
                          <ErrorMessage
                            style={{ color: "orange" }}
                            component="div"
                            name="postal_code"
                          />
                          <FormLabel mt={4}>Full Address</FormLabel>
                          <Field
                            placeholder="Jalan In Aja Dulu"
                            name="full_address"
                            as={Textarea}
                            maxLength="200"
                          />
                          <ErrorMessage
                            style={{ color: "orange" }}
                            component="div"
                            name="full_address"
                          />
                          <Checkbox
                            colorScheme={"pink"}
                            mt={2}
                            onChange={() => handleStatus()}
                            title={
                              address?.length ? "(Optional)" : "(Recommended)"
                            }
                            defaultChecked={address?.length ? false : true}
                            isDisabled={address?.length ? false : true}
                          >
                            Make it the Main Address
                          </Checkbox>
                        </Flex>
                      </FormControl>
                    </ModalBody>
                    <ModalFooter
                      display={"flex"}
                      flexDirection={"column"}
                      gap={4}
                      textAlign={"center"}
                    >
                      <FormControl>
                        <FormHelperText>
                          By clicking "Save", you agree to the{" "}
                          <Text as={"span"} color={"#D54B79"}>
                            Terms & Conditions
                          </Text>
                          .
                        </FormHelperText>
                      </FormControl>
                      <Button
                        colorScheme="pink"
                        type="submit"
                        isLoading={isLoading}
                      >
                        Save
                      </Button>
                    </ModalFooter>
                  </Form>
                </>
              );
            }}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
