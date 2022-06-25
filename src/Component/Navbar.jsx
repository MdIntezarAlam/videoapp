import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.jpg";
import logo2 from "../img/logo2.jpg";
import i from "../img/i.PNG";
// prettier ignore
import { IoAdd, IoMoon, IoSearch, IoSunny, IoLogOut } from "react-icons/io5";

import {
  Flex,
  InputGroup,
  Input,
  Image,
  useColorModeValue,
  useColorMode,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.600", "gray.300");
  const [userId, setuserId] = useState(null);
  return (
    <Flex
      justifyContent={"space-between"}
      alignItems="center"
      width={"100vw"}
      p={4}
    >
      <Link to="/">
        <Image
          src={colorMode == "light" ? logo2 : logo}
          height={"40px"}
          width={"110px"}
        ></Image>
      </Link>

      <InputGroup mx={6} width="60vw">
        <InputLeftElement
          pointerEvents="none"
          fontSize={15}
          children={<IoSearch />}
        />
        <Input
          type="text"
          placeholder="search here...."
          border={"none"}
          fontWeight="medium"
          variant={"filled"}
        />
      </InputGroup>
      <Flex justifyContent={"center"} alignItems="center">
        <Flex
          width={"48px"}
          height="40px"
          justifyContent={"center"}
          alignItems="center"
          cursor={"pointer"}
          borderRadius="5px"
          onClick={toggleColorMode}
        >
          {colorMode == "light" ? <IoMoon fontSize={25} /> : <IoSunny />}
        </Flex>

        {/* this is Create Button Components */}
        <Link to={""}>
          <Flex
            width="40px"
            height={"40px"}
            borderRadius="50%"
            alignItems="center"
            justifyContent={"center"}
            mx="6"
            bg={bg}
            cursor={"pointer"}
            _hover={{ shadow: "md" }}
            transition="ease-in-out"
            transitionDuration={"0.3sec"}
          >
            <IoAdd
              fontSize={25}
              color={`${colorMode == "dark" ? "#111" : "#f1f1f1"}`}
            />
          </Flex>
        </Link>

        {/* this is menu toogle(add icons menu) */}
        <Menu>
          <MenuButton>
            <Image
              // here should be like that  src={user?.i}
              src={user?.photoURL}
              width="40px"
              height={"40px"}
              rounded="full"
              // borderRadius={"50%"}
            />
          </MenuButton>
          <MenuList shadow={"lg"}>
            {/* <Link to={`/userDetail/${userId}`}> */}
            <Link to={`/userDetail/${userId}`}>
              <MenuItem>My Account</MenuItem>
            </Link>
            <MenuItem
              flexDirection={"row"}
              alignItems="center"
              gap={4}
              onClick={() => {
                localStorage.clear();
                navigate("/login", { replace: true });
              }}
            >
              Logout
              <IoLogOut fontSize={20} />
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;
