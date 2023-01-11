import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Card,
  CardBody,
  Image,
  Flex,
  Button,
  Stack,
  Text,
  Box,
  useToast,
  useMediaQuery,
} from "@chakra-ui/react";

import {
  SettingName,
  SettingBirthDate,
  SettingGender,
  SettingPhoto,
  SettingPassword,
  SettingEmail,
} from "./ProfileSettings";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const Profile = () => {
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const [settingRow] = useMediaQuery("(max-width: 909px)");
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [birthDate, setbirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  const getUser = async () => {
    try {
      // masih nembak lewat params, niatnya ambil user dari redux
      const response = await (await axios.get(`${baseApi}/user/1`)).data;
      setUser(response);
      setName(response.name);
      setbirthDate(response.birthDate);
      setGender(response.gender);
      setEmail(response.email);
    } catch (error) {
      console.error(error);
    }
  };

  const settingUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!birthDate) {
        setLoading(false);
        return toast({
          position: "top",
          title: "Date of Birth must be filled in",
          status: "warning",
          isClosable: true,
        });
      }
      if (name.length < 4) {
        setLoading(false);
        return toast({
          position: "top",
          title: "Minimum Name 4",
          status: "warning",
          isClosable: true,
        });
      }
      if (name.length > 25) {
        setLoading(false);
        return toast({
          position: "top",
          title: "Maksimal Name 25",
          status: "warning",
          isClosable: true,
        });
      }
      await axios.patch(`${baseApi}/user/settings/${user.id}`, {
        name,
        birthDate,
        gender,
      });
      setTimeout(() => setLoading(false), 2500);
      toast({
        position: "top",
        title: "Berhasil",
        status: "success",
        isClosable: true,
      });
      setTimeout(() => getUser(), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChoose = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!image) {
        return toast({
          position: "top",
          title: "Select Photo First",
          status: "warning",
          isClosable: true,
        });
      }
      if (image.size > 1028576) {
        return toast({
          position: "top",
          title: "Photo Size Too Large, maximum 1MB.",
          status: "warning",
          isClosable: true,
        });
      }
      setLoading(true);
      const data = new FormData();
      data.append("image", image);

      await axios.post(`${baseApi}/user-upload/${user.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTimeout(
        () =>
          toast({
            position: "top",
            title: "Successfully Transform Photo",
            status: "success",
            isClosable: true,
          }),
        2000
      );
      setTimeout(() => setLoading(false), 2500);
      setImage("");
      setTimeout(() => window.location.reload(), 4000);
    } catch (error) {
      console.error(error);
    }
  };
  const minString = (str, num) => {
    if (str?.length > num) return str.slice(0, num) + "...";
    return str;
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <Flex gap={7} direction={settingRow ? "column" : "row"}>
      <Box flex={"1"}>
        <Card boxShadow="0 0 3px white" mb={10} color={"inherit"}>
          <CardBody>
            <Image
              src={`${process.env.REACT_APP_SERVER}${user.picture}`}
              alt="profile-image"
              border={"1px"}
              borderColor={"rgba(1,2,3,1)"}
              borderRadius="lg"
              w={300}
              h={300}
              m="auto"
              objectFit={"cover"}
            />
            <Stack mt="6" spacing="3" border={"2px"} borderRadius={"md"} p="5">
              <SettingPhoto
                user={user}
                handleChoose={handleChoose}
                handleUpload={handleUpload}
                image={image}
                setImage={setImage}
                minString={minString}
                isLoading={isLoading}
              />
              <Text>
                File size: maximum 1MB. Allowed file extensions: .JPG .JPEG .PNG
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Stack>
          <SettingPassword user={user} baseApi={baseApi} toast={toast} />
        </Stack>
      </Box>
      <Box
        flex={"1"}
        p={3}
        borderRadius={"lg"}
        h="50%"
        boxShadow="0 0 3px white"
      >
        <Flex direction={"column"}>
          <Box>
            <Stack mb={6}>
              <Text as={"b"}>Change Your Bio</Text>
            </Stack>
            <form onSubmit={settingUser}>
              <Flex mb={6}>
                <Box flex="0.3">
                  <Text>Name</Text>
                </Box>
                <Box flex="0.7" display={"flex"} gap={4}>
                  <Text>
                    {user?.name !== name
                      ? minString(name, 13)
                      : minString(user?.name, 13)}
                  </Text>
                  <SettingName user={user} name={name} setName={setName} />
                </Box>
              </Flex>
              <Flex mb={6}>
                <Box flex="0.3">
                  <Text>Date of Birth</Text>
                </Box>
                <Box flex="0.7" display={"flex"} gap={4}>
                  <Text>
                    {user?.birthDate !== birthDate
                      ? birthDate
                      : user?.birthDate}
                    {!birthDate ? "hh-bb-tttt" : ""}
                  </Text>
                  <SettingBirthDate
                    user={user}
                    birthDate={birthDate}
                    setbirthDate={setbirthDate}
                  />
                </Box>
              </Flex>
              <Flex mb={6}>
                <Box flex="0.3">
                  <Text>Gender</Text>
                </Box>
                <Box flex="0.7" display={"flex"} gap={4}>
                  <Text>{user?.gender !== gender ? gender : user?.gender}</Text>
                  <SettingGender
                    user={user}
                    gender={gender}
                    setGender={setGender}
                  />
                </Box>
              </Flex>
              <Stack mb={6} alignItems={"flex-end"}>
                <Button
                  variant={"outline"}
                  _hover={{ color: "black", bg: "white" }}
                  width={"50%"}
                  type={"submit"}
                  hidden={
                    user?.name !== name ||
                    user?.birthDate !== birthDate ||
                    user?.gender !== gender
                      ? false
                      : true
                  }
                  isLoading={isLoading}
                >
                  Save
                </Button>
              </Stack>
            </form>
          </Box>
          <Box>
            <Stack mb={6}>
              <Text as={"b"}>Change Contact</Text>
            </Stack>
            <Flex mb={6}>
              <Box flex="0.3">
                <Text>Email</Text>
              </Box>
              <Box flex="0.7" display={"flex"} gap={4}>
                <Text>
                  {user?.email !== email
                    ? minString(email, 11)
                    : minString(user?.email, 11)}
                </Text>
                <SettingEmail
                  user={user}
                  email={email}
                  baseApi={baseApi}
                  toast={toast}
                />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
