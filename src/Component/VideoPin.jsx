import React, { useState, useEffect } from "react";
import {
  Flex,
  useColorModeValue,
  useColorMode,
  Text,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getUserInfo } from "../Utils/FetchData";
import { getFirestore } from "firebase/firestore";
// import { getAllFeeds } from "../Utils/FetchData";
import { firebaseApp } from "../firebase-config";
import moment from "moment";

const avatar =
  "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mo-mockup-118823744.jpg";

const VideoPin = ({ data }) => {
  const firestoredb = getFirestore(firebaseApp);
  const [userInfo, setuserInfo] = useState(null);
  const [userId, setuserId] = useState(null);

  // this is for backgraound color variaBLE
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("blackAlpha.700", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.100");

  useEffect(() => {
    if (data) setuserId(data.userId);
    if (userId)
      getUserInfo(firestoredb, userId).then((data) => {
        setuserInfo(data);
      });
  }, [userId]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      cursor="pointer"
      shadow={"lg"}
      _hover={{ shadow: "xl" }}
      rounded="md"
      overflow={"hidden"}
      position="relative"
      maxWidth={"300px"}
      height="180px" //180
      bg="gray.200"
      p={1}
      borderRadius={10}
      mt={"20px"}
    >
      <Link to={`/videoDetails/${data?.id}`}>
        {/* url is comming from firebase */}
        <video
          src={data.videoUrl}
          muted
          onMouseOver={(e) => e.target.play()}
          onMouseOut={(e) => e.target.pause()}
        />
      </Link>
      <Flex
        position={"absolute"}
        bottom="0"
        left="0"
        p={2}
        bg={bg}
        width={"full"}
        direction="column"
      >
        <Flex width="full" justifyContent="space-between" alignItems={"center"}>
          <Text color={textColor} fontSize={20}>
            {data.title}
          </Text>
          <Link to={`/userDetail/${userId}`}>
            <Image
              src={userInfo?.photoURL ? userInfo?.photoURL : avatar}
              rounded="full"
              width={"40px"}
              height={"40px"}
              minHeight={"50px"}
              minWidth={"50px"}
              borderRadius={"50%"}
              borderColor={bg}
              mt={-1}
            />
          </Link>
        </Flex>
        <Text fontSize={12} color={textColor} ml="auto">
          {moment(new Date(parseInt(data.id)).toISOString()).fromNow()}
        </Text>
      </Flex>
    </Flex>
  );
};

export default VideoPin;