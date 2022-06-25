import { useState, useEffect } from "react";
import { Flex, Image } from "@chakra-ui/react";
import Spinner from "./Spinner";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import { useParams } from "react-router-dom";
import { getUserInfo, userUploadedVideos } from "../Utils/FetchData";
import RecemendVideo from "./RecemendVideo";

const randoms =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfgPEuSjYukMlsLp23D-f9rPpyw2HFXiA7zQ&usqp=CAU";

const random__2 =
  "https://media.istockphoto.com/photos/taj-mahal-mausoleum-in-agra-picture-id1146517111?k=20&m=1146517111&s=612x612&w=0&h=vHWfu6TE0R5rG6DJkV42Jxr49aEsLN0ML-ihvtim8kk=";

const UserProfile = () => {
  const { userId } = useParams();
  const [isLoading, setisLoading] = useState(false);
  const [userInfo, setuserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const firebasedb = getFirestore(firebaseApp);

  useEffect(() => {
    setisLoading(true);
    if (userId) {
      getUserInfo(firebasedb, userId).then((user) => {
        setuserInfo(user);
      });

      userUploadedVideos(firebasedb, userId).then((feed) => {
        setFeeds(feed);
      });
      setisLoading(false);
    }
  }, [userId]);

  if (isLoading) return <Spinner />;

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      width={"full"}
      height={"auto"}
      p={2}
      direction={"column"}
    >
      <Flex
        position={"relative"}
        alignItems={"center"}
        justifyContent={"center"}
        width={"full"}
        p={2}
        direction={"column"}
      >
        <Image
          src={randoms}
          height={"330px"}
          width="full"
          objectFit={"cover"}
          borderRadius={"md"}
        />
        <Image
          src={random__2}
          width="120px"
          objectFit={"cover"}
          height={"120px"}
          border="2px"
          borderColor={"gray.100"}
          shadow={"lg"}
          rounded="full"
          mt={-16}
        />
      </Flex>
      {feeds && (
        <Flex direction={"column"} width="full" my={6}>
          <RecemendVideo feeds={feeds} />
        </Flex>
      )}
    </Flex>
  );
};

export default UserProfile;
