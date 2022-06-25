import { Button, Flex, HStack, Image } from "@chakra-ui/react";
import React from "react";
import b from "../img/b.avif";
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const firebaseAuth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const firebasedb = getFirestore(firebaseApp);

  const navigate = useNavigate();

  //button
  const login = async () => {
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { refreshToken, providerData } = user;
    // console.log(refreshToken, providerData);
    localStorage.setItem("user", JSON.stringify(providerData));
    localStorage.setItem("accessToken", JSON.stringify(refreshToken));

    await setDoc(
      doc(firebasedb, "users", providerData[0].uid),
      providerData[0]
    );

    navigate("/", { replace: true });
  };

  return (
    <Flex
      justify={"center"}
      alignItems={"center"}
      width={"100vw"}
      height={"100vh"}
      position={"relative"}
    >
      <Image src={b} objectFit="cover" width={"full"} height={"full"} />
      <Flex
        position={"absolute"}
        width={"100vw"}
        height={"100vh"}
        bg={"blackAlpha.500"}
        top={"0"}
        left={"0"}
        justifyContent="center"
        alignItems={"center"}
      >
        <HStack>
          <Button
            color="#f1f1f1"
            onClick={login}
            leftIcon={
              <FcGoogle fontSize={20} colorscheme="whiteAlpha" shadow={"lg"} />
            }
          >
            Sigin with Google to constinue
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Login;
