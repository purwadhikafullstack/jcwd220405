import { Box, Container, Heading, Text, Image, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import mokomdo from "../../assets/mokomdo2.png";

export const UnAuthorizedRequest = () => {
  const navigate = useNavigate();
  const backHome = () => {
    navigate("/");
  };
  return (
    <Container maxW={"full"}>
      <Box margin={"auto"} textAlign="center" color="white">
        <Heading mt={10}>Something Went Wrong</Heading>
        <Box display={"flex"} justifyContent={"center"}>
          <Box
            display={"grid"}
            bg="#FFF0F5"
            p={10}
            my={50}
            borderRadius={10}
            borderColor={"rgba(231, 56, 145,.234)"}
            maxW={"100%"}
            h={"500px"}
            w={"1500px"}
            flexDirection={"column"}
            color="black"
            // margin="auto"
          >
            <Box>
              <Image src={mokomdo} m="auto" />
            </Box>
            <Box>
              <Text fontSize={"2xl"}>
                You are not authorized for this action
              </Text>
              <Text mt={5} fontSize={"2xl"}>
                Please Try Again
              </Text>
              <Button
                bg={"#D0BDAC"}
                color="black"
                mt={10}
                onClick={() => backHome()}
              >
                Take me back!
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
