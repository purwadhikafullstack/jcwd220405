// // chakra
// import {
//   Drawer,
//   DrawerContent,
//   DrawerCloseButton,
//   Stack,
//   Button,
//   useDisclosure,
//   Box,
//   Flex,
//   Image,
//   IconButton,
//   Container,
// } from "@chakra-ui/react";

// // logo
// import mokomdo2 from "../../assets/mokomdo-simplified2.png";

// // icon
// import { FiMenu } from "react-icons/fi";

// export const DrawerAdmin = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   return (
//     <Box>
//       <Container>
//         <IconButton
//           icon={<FiMenu />}
//           color={"white"}
//           display={{ base: "flex", md: "none" }}
//           onClick={onOpen}
//           variant="outline"
//           aria-label="open menu"
//         />
//         <Box
//           transition="3s ease"
//           bg={"#351734"}
//           // borderRight={"1px solid white"}
//           w={{ base: 40, md: 60 }}
//           pos="fixed"
//           h="full"
//           display={{ base: "none", md: "block" }}
//           onClose={() => onClose}
//           left={0}
//           top={0}
//         >
//           <DrawerItems />
//           <Drawer
//             autoFocus={false}
//             isOpen={isOpen}
//             placement="left"
//             onClose={onClose}
//             returnFocusOnClose={false}
//             onOverlayClick={onClose}
//             size={"xs"}
//           >
//             <DrawerContent bg={"#351734"}>
//               <DrawerCloseButton color={"white"} />
//               <DrawerItems onClose={onClose} />
//             </DrawerContent>
//           </Drawer>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// const DrawerItems = () => {
//   const items = ["Users", "Warehouses", "Items", "Report"];

//   return (
//     <Box>
//       <Flex
//         h={{ base: "20" }}
//         alignItems={"center"}
//         justifyContent={"center"}
//         borderBottom={"1px solid white"}
//       >
//         <Image w={{ base: "auto" }} h={{ base: "10" }} src={mokomdo2} />
//       </Flex>
//       <Stack paddingTop={"2"}>
//         {items.map((item) => {
//           return (
//             <Button
//               borderRadius={0}
//               color={"white"}
//               bg={"none"}
//               _hover={{ bg: "#C146ED" }}
//             >
//               {item}
//             </Button>
//           );
//         })}
//       </Stack>
//     </Box>
//   );
// };
