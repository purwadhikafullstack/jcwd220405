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
  InputGroup,
  Textarea,
  useToast,
  Box,
} from "@chakra-ui/react";
import swal from "sweetalert";

import React, { useState } from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const geoapifyKey = process.env.REACT_APP_GEOAPIFY_KEY;

export const AddAddress = ({ address, baseApi, search, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const [cityType, setCityType] = useState("");
  const [status, setStatus] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const handleStatus = () => setStatus(!status);

  const addressValid = Yup.object().shape({
    received_name: Yup.string()
      .required("Required")
      .min(3, "Recipient Name at least 3")
      .max(50, "Recipient Name maximum 50"),
    province: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    postal_code: Yup.string().required("Required"),
    full_address: Yup.string()
      .required("Required")
      .max(200, "Address maximum 200"),
  });

  const add = async (value) => {
    try {
      if (!cityType) {
        return toast({
          position: "top",
          title: "Select City/Regency",
          status: "warning",
          isClosable: true,
        });
      }
      setLoading(true);
      if (!lat) {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/search?street=${value.full_address}&postcode=${value.postal_code}&city=${value.city}&apiKey=${geoapifyKey}`
        );
        setLat(response.data.features[0].bbox[1]);
        setLng(response.data.features[0].bbox[0]);
        setTimeout(() => setLoading(false), 1500);
        return toast({
          position: "top",
          title: "Please check your address again",
          status: "warning",
          isClosable: true,
        });
      }

      // masih nembak lewat params, niatnya ambil user dari redux
      await axios.post(`${baseApi}/address/${id}`, {
        received_name: value.received_name,
        province: value.province,
        city_type: cityType,
        city: value.city,
        postal_code: value.postal_code,
        full_address: value.full_address,
        status: status,
        lat: lat,
        lng: lng,
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
      setTimeout(() => window.location.reload(), 4000);
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
          border={"2px"}
          borderColor={"rgba(231, 56, 145,.69)"}
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
              received_name: "",
              province: "",
              city_type: "",
              city: "",
              postal_code: "",
              full_address: "",
              status: "",
            }}
            validationSchema={addressValid}
            onSubmit={(value) => {
              add(value);
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
                          <Input
                            placeholder="Jawa Barat"
                            name="province"
                            as={Field}
                            maxLength="25"
                          />
                          <ErrorMessage
                            style={{ color: "orange" }}
                            component="div"
                            name="province"
                          />
                          <FormLabel mt={4}>City/Regency</FormLabel>
                          <Select placeholder="Select..." name="city_type">
                            <option
                              value="Kota"
                              onClick={() => setCityType("Kota")}
                            >
                              City
                            </option>
                            <option
                              value="Kabupaten"
                              onClick={() => setCityType("Kabupaten")}
                            >
                              Regency
                            </option>
                          </Select>
                          <InputGroup
                            flexDirection={"column"}
                            hidden={cityType ? false : true}
                          >
                            <FormLabel mt={4}>
                              {cityType === "Kota" ? "City" : "Regency"}
                            </FormLabel>
                            <Input
                              placeholder="Bekasi"
                              name="city"
                              as={Field}
                              maxLength="25"
                            />
                            <ErrorMessage
                              style={{ color: "orange" }}
                              component="div"
                              name="city"
                            />
                          </InputGroup>
                          <FormLabel mt={4}>Postal Code</FormLabel>
                          <Input
                            placeholder="17610"
                            name="postal_code"
                            as={Field}
                            maxLength="5"
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

export const EditAddress = ({ baseApi, item, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const [cityType, setCityType] = useState("");
  const [status, setStatus] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const handleStatus = () => setStatus(!status);

  const handleEdit = async () => {
    const once = await swal("Cancel edit?", {
      dangerMode: true,
      buttons: true,
    });
    if (once) {
      onClose();
    }
  };

  const addressValid = Yup.object().shape({
    received_name: Yup.string()
      .required("Required")
      .min(3, "Recipient Name at least 3")
      .max(50, "Recipient Name maximum 50"),
    province: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    postal_code: Yup.string().required("Required"),
    full_address: Yup.string()
      .required("Required")
      .max(200, "Address maximum 200"),
  });

  const edit = async (value) => {
    try {
      if (!cityType) {
        return toast({
          position: "top",
          title: "Select City/Regency",
          status: "warning",
          isClosable: true,
        });
      }
      setLoading(true);
      if (!lat) {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/search?street=${value.full_address}&postcode=${value.postal_code}&city=${value.city}&apiKey=${geoapifyKey}`
        );
        setLat(response.data.features[0].bbox[1]);
        setLng(response.data.features[0].bbox[0]);
        setTimeout(() => setLoading(false), 1500);
        return toast({
          position: "top",
          title: "Please check your address again",
          status: "warning",
          isClosable: true,
        });
      }

      // masih nembak lewat params, niatnya ambil user dari redux
      await axios.patch(`${baseApi}/address/${id}`, {
        received_name: value.received_name,
        province: value.province,
        city_type: cityType,
        city: value.city,
        postal_code: value.postal_code,
        full_address: value.full_address,
        status: value.status ? value.status : status,
        lat: lat,
        lng: lng,
        id: item.id,
      });
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Successfully Change Address",
            status: "success",
            isClosable: true,
          }),
        2000
      );
      setTimeout(() => setLoading(false), 2500);
      setTimeout(() => window.location.reload(), 4000);
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
  return (
    <>
      <Text cursor={"pointer"} onClick={onOpen}>
        Change Address
      </Text>

      <Modal
        isOpen={isOpen}
        closeOnOverlayClick={false}
        scrollBehavior={"outside"}
        size={{ base: "md", md: "2xl" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={"auto"}>Change Address</ModalHeader>
          <ModalCloseButton onClick={handleEdit} />
          <Divider />
          <Formik
            initialValues={{
              received_name: item.received_name,
              province: item.province,
              city_type: item.cityType,
              city: item.city,
              postal_code: item.postal_code,
              full_address: item.full_address,
              status: item.status,
            }}
            validationSchema={addressValid}
            onSubmit={(value) => {
              edit(value);
            }}
          >
            {(props) => {
              return (
                <>
                  <Form>
                    <ModalBody pb={6} mt={4}>
                      <Text as={"b"} fontSize={"20px"}>
                        Please make sure your address is correct
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
                          <Input
                            placeholder="Jawa Barat"
                            name="province"
                            as={Field}
                            maxLength="25"
                          />
                          <ErrorMessage
                            style={{ color: "orange" }}
                            component="div"
                            name="province"
                          />
                          <FormLabel mt={4}>City/Regency</FormLabel>
                          <Select placeholder="Select..." name="city_type">
                            <option
                              value="Kota"
                              onClick={() => setCityType("Kota")}
                            >
                              City
                            </option>
                            <option
                              value="Kabupaten"
                              onClick={() => setCityType("Kabupaten")}
                            >
                              Regency
                            </option>
                          </Select>
                          <InputGroup
                            flexDirection={"column"}
                            hidden={cityType ? false : true}
                          >
                            <FormLabel mt={4}>
                              {cityType === "Kota" ? "City" : "Regency"}
                            </FormLabel>
                            <Input
                              placeholder="Bekasi"
                              name="city"
                              as={Field}
                              maxLength="25"
                            />
                            <ErrorMessage
                              style={{ color: "orange" }}
                              component="div"
                              name="city"
                            />
                          </InputGroup>
                          <FormLabel mt={4}>Postal Code</FormLabel>
                          <Input
                            placeholder="17610"
                            name="postal_code"
                            as={Field}
                            maxLength="5"
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
                            defaultChecked={item.status ? true : false}
                            disabled={item.status ? true : false}
                            title={item.status ? "This main address" : "Main"}
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

export const DeleteAddress = ({ item, getAddressUser, baseApi, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const deleteAddress = async (item) => {
    try {
      setLoading(true);
      // masih nembak lewat params, niatnya ambil user dari redux
      await axios.post(`${baseApi}/address/d/${id}`, { id: item.id });
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Successfully Delete Address",
            status: "success",
            isClosable: true,
          }),
        2000
      );
      setTimeout(() => setLoading(false), 2500);
      setTimeout(() => onClose(), 2500);
      setTimeout(() => getAddressUser(), 3500);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      <Text
        cursor={"pointer"}
        hidden={item.status ? true : false}
        onClick={onOpen}
      >
        Delete
      </Text>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Delete Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={"center"}>Are you sure?</ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              bgColor="rgba(204,51,0,1)"
              color={"white"}
              _hover={{ bgColor: "rgba(200,50,10,.88)" }}
              onClick={() => deleteAddress(item)}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
