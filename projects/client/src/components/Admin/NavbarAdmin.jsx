// import {
//   Avatar,
//   Box,
//   Flex,
//   HStack,
//   VStack,
//   useColorModeValue,
//   Text,
//   Menu,
//   MenuButton,
//   MenuDivider,
//   MenuItem,
//   MenuList,
//   Image,
// } from "@chakra-ui/react";

// // icon
// import { FiChevronDown } from "react-icons/fi";

// // logo
// import mokomdo2 from "../../assets/mokomdo-simplified2.png";

// // comp
// import { DrawerAdmin } from "./DrawerAdmin";

// export const NavbarAdmin = () => {
//   return (
//     <Flex
//       ml={{ base: 0, md: 60 }}
//       px={{ base: 4, md: 4 }}
//       height={"20"}
//       alignItems="center"
//       bg={"#351734"}
//       justifyContent={{ base: "space-between", md: "flex-end" }}
//       borderLeft={"1px solid white"}
//     >
//       <DrawerAdmin />

//       <Image
//         src={mokomdo2}
//         display={{ base: "block", md: "none" }}
//         w={"auto"}
//         h={10}
//       />

//       <HStack spacing={{ base: "0", md: "6" }}>
//         <Flex alignItems={"center"}>
//           <Menu>
//             <MenuButton
//               py={2}
//               transition="all 0.3s"
//               _focus={{ boxShadow: "none" }}
//             >
//               <HStack>
//                 <Avatar
//                   size={"sm"}
//                   src={"https://bit.ly/broken-link"}
//                   border={"1px solid white"}
//                 />
//                 <VStack
//                   display={{ base: "none", md: "flex" }}
//                   alignItems="flex-start"
//                   spacing="1px"
//                   ml="2"
//                 >
//                   <Text fontSize="sm" color="white">
//                     Anthony
//                   </Text>
//                   {/* <Text fontSize="xs" color="white">
//                     Admin
//                   </Text> */}
//                 </VStack>
//                 <Box display={{ base: "none", md: "flex" }}>
//                   <FiChevronDown color={"white"} />
//                 </Box>
//               </HStack>
//             </MenuButton>
//             <MenuList
//               bg={useColorModeValue("white", "gray.900")}
//               borderColor={useColorModeValue("gray.200", "gray.700")}
//             >
//               <MenuItem>Profile</MenuItem>
//               <MenuItem>Settings</MenuItem>
//               <MenuDivider />
//               <MenuItem>Sign out</MenuItem>
//             </MenuList>
//           </Menu>
//         </Flex>
//       </HStack>
//     </Flex>
//   );
// };
