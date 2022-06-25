import { useRef } from "react";
import { useState, useEffect } from "react";
import { fetchUser } from "../Utils/Fetchuser";
import { deleteVideo, recommendedFeed } from "../Utils/FetchData";
import { IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { FcApproval } from "react-icons/fc";
import logo from "../img/logo.jpg";
import {
  MdOutlineReplay10,
  MdForward10,
  MdVolumeUp,
  MdVolumeOff,
  MdFullscreen,
} from "react-icons/md";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Image,
  MenuProvider,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import Spinner from "../Component/Spinner";
import { getSpecificVideo, getUserInfo } from "../Utils/FetchData";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import HTMLReactParser from "html-react-parser";
import moment from "moment";
import RecemendVideo from "./RecemendVideo";
import { dblClick } from "@testing-library/user-event/dist/click";
const avatar =
  "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mo-mockup-118823744.jpg";

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds + 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

const VideoPinDetails = () => {
  const textColor = useColorModeValue("gray.900", "gray.50");

  const firestoredb = getFirestore(firebaseApp);
  const { videoId } = useParams();
  const [localUser] = fetchUser();
  const navigate = useNavigate();
  const [isloading, setIsLading] = useState(false);
  const [videoInfo, setvideoInfo] = useState(null);
  const [isPlaying, setisPlaying] = useState(false); // for video player control
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [userInfo, setuserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);
  // Custom reference
  const playerRef = useRef();
  const playerContainer = useRef();
  // this useEffect will render if only videoid change
  useEffect(() => {
    if (videoId) {
      setIsLading(true);
      getSpecificVideo(firestoredb, videoId).then((data) => {
        setvideoInfo(data);

        recommendedFeed(firestoredb, data.category, videoId).then((feed) => {
          setFeeds(feed);
        });

        getUserInfo(firestoredb, data.userId).then((user) => {
          setuserInfo(user);
        });
        setIsLading(false);
      });
    }
  }, [videoId]);

  // this useEffect will render  if there is any changes in mutted state, playing state
  useEffect(() => {}, [muted, volume, played]);

  const onvolumechange = (e) => {
    setVolume(parseFloat(e / 100));

    e === 0 ? setMuted(true) : setMuted(false);
  };

  const handlerFastRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };
  const handlerFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handlerProgress = (changeState) => {
    if (!seeking) {
      setPlayed(parseFloat(changeState.played / 100) * 100);
    }
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e / 200));
  };

  const onSeekMouseDown = (e) => {
    setSeeking(true);
  };
  const onSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(e / 100);
  };

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  // Video Duration
  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapsedTime = format(currentTime);
  const totalDuration = format(duration);
  if (isloading) return <Spinner />;

  const deleteTheVideo = (videoId) => {
    setIsLading(true);
    deleteVideo(firestoredb, videoId);
    navigate("/", { replace: true });
  };

  return (
    <Flex
      width={"full"}
      height="auto"
      justifyContent={"center"}
      alignItems={"center"}
      direction="column"
      py={2}
      px={4}
    >
      <Flex alignItems={"center"} width="full" my={4}>
        <Link to={"/"}>
          <IoHome fontSize={25} />
        </Link>
        <Box width="1px" height={"25px"} bg={"gray.500"} mx={2}></Box>
        <Text
          isTruncated
          color={textColor}
          fontWeight="semibold"
          width={"100%"}
        >
          {videoInfo?.title}
        </Text>
      </Flex>

      {/*  This is main components of video Grid */}
      <Grid templateColumns="repeat(4, 1fr)" gap={2} width="100%">
        <GridItem width={"100%"} colSpan="3">
          <Flex
            width={"full"}
            bg={"black"}
            position="relative"
            ref={playerContainer}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoInfo?.videoUrl}
              width="100%"
              height={"100%"}
              playing={isPlaying}
              muted={muted}
              volume={volume}
              onProgress={handlerProgress}
            />

            {/* Controls for video player */}
            <Flex
              position={"absolute"}
              top={0}
              left={0}
              right={0}
              bottom={0}
              direction="column"
              justifyContent={"space-between"}
              alignItems="center"
              zIndex={1}
              cursor="pointer"
            >
              {/* Player icons is here */}
              <Flex
                alignItems={"center"}
                justifyContent="center"
                onClick={() => {
                  setisPlaying(!isPlaying);
                }}
                width={"full"}
                height="full"
              >
                {!isPlaying && (
                  <IoPlay fontSize={60} color="#f2f2f2" cursor={"pointer"} />
                )}
              </Flex>
              {/* This is for Progress controls */}
              <Flex
                width={"full"}
                alignItems="center"
                direction={"column"}
                px={4}
                bgGradient="linear(to-t, blackAlpha.900,, blackAlpha.500, blackAlpha.50)"
              >
                {/* Slider */}
                <Slider
                  aria-label="slider-ex-4"
                  min={0}
                  max={100}
                  value={played * 100}
                  transition="ease-in-out"
                  transitionDuration={"0.2"}
                  onChange={handleSeekChange}
                  onMouseDown={onSeekMouseDown}
                  onChangeEnd={onSeekMouseUp}
                >
                  <SliderTrack bg="teal.50">
                    <SliderFilledTrack bg="teal.300" />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={3}
                    bg="teal.300"
                    transition="ease-in-out"
                    transitionDuration={"0.2"}
                  />
                </Slider>

                {/* Other Player */}
                <Flex width={"full"} alignItems={"center"} my={2} gap={10}>
                  <MdOutlineReplay10
                    fontSize={30}
                    color="#f1f1f1"
                    cursor={"pointer"}
                    onClick={handlerFastRewind}
                  />
                  <Box onClick={() => setisPlaying(!isPlaying)}>
                    {!isPlaying ? (
                      <IoPlay
                        fontSize={30}
                        color="#f2f2f2"
                        cursor={"pointer"}
                      />
                    ) : (
                      <IoPause
                        fontSize={30}
                        color="#f2f2f2"
                        cursor={"pointer"}
                      />
                    )}
                  </Box>
                  <MdForward10
                    fontSize={30}
                    color="#f1f1f1"
                    cursor={"pointer"}
                    onClick={handlerFastForward}
                  />
                  {/* This is for Volume Controls */}
                  <Flex alignItems={"center"}>
                    <Box onClick={() => setMuted(!muted)}>
                      {!muted ? (
                        <MdVolumeUp
                          fontSize={30}
                          color="#f1f1f1"
                          cursor={"pointer"}
                        />
                      ) : (
                        <MdVolumeOff
                          fontSize={30}
                          color="#f1f1f1"
                          cursor={"pointer"}
                        />
                      )}
                    </Box>
                    {/* Slider */}
                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={volume * 100}
                      min={0}
                      max={100}
                      size="sm"
                      width={16}
                      mx={2}
                      onChangeStart={onvolumechange}
                      onChange={onvolumechange}
                    >
                      <SliderTrack bg="teal.50">
                        <SliderFilledTrack bg="teal.300" />
                      </SliderTrack>
                      <SliderThumb boxSize={3} bg="teal.300" />
                    </Slider>
                  </Flex>
                  {/* this is Duration contorls */}
                  <Flex alignItems={"center"} gap={2}>
                    <Text fontSize={16} color="whitesmoke">
                      {elapsedTime}
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      /
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      {totalDuration}
                    </Text>
                  </Flex>
                  <Image
                    src={logo}
                    width="50px"
                    height={"50px"}
                    borderRadius={"50%"}
                    ml="auto"
                  />
                  <MdFullscreen
                    fontSize={30}
                    color="#f1f1f1"
                    cursor={"pointer"}
                    onClick={() => {
                      screenfull.toggle(playerContainer.current);
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          {/* Description video */}
          {videoInfo?.description && (
            <Flex my={6} direction="column">
              <Text my={2} fontSize={25} fontWeight="semibold">
                Description
              </Text>
              {HTMLReactParser(videoInfo?.description)}
            </Flex>
          )}
        </GridItem>
        <GridItem width={"100%"} colSpan="1">
          {userInfo && (
            <Flex direction={"column"} width={"full"}>
              <Flex alignItems={"center"} width={"full"}>
                <Image
                  src={userInfo?.photoURL ? userInfo?.photoURL : avatar}
                  rounded="full"
                  width={"60px"}
                  height={"60px"}
                  minHeight={"60px"}
                  minWidth={"60px"}
                />

                <Flex fontSize={12} direction="column" ml={3}>
                  <Flex alignItems={"center"}>
                    <Text isTruncated color={textColor} fontWeight="semibold">
                      {userInfo?.displayName}
                    </Text>
                    <FcApproval fontSize={23} />
                  </Flex>
                  {videoInfo?.id && (
                    <Text fontSize={12}>
                      {moment(
                        new Date(parseInt(videoInfo.id)).toISOString()
                      ).fromNow()}
                    </Text>
                  )}
                </Flex>
              </Flex>
              {/* this is Action Button */}
              <Flex justifyContent={"space-around"} mt={6}>
                {userInfo?.userId === localUser.userId && (
                  <Popover closeOnEsc>
                    <PopoverTrigger>
                      <Button colorScheme={"red"}>
                        <IoTrash fontSize={20} color="#f1f1f1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">
                        Confirmation
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        Are you sure you want to delete it ?
                      </PopoverBody>
                      <PopoverFooter display="flex" justifyContent="flex-end">
                        <ButtonGroup size="sm">
                          <Button
                            colorScheme="red"
                            onClick={() => deleteTheVideo(videoId)}
                          >
                            yes
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                )}

                <a
                  href={videoInfo.videoUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button colorScheme={"blue"} rounded="full" my={2} mt={"0"}>
                    Free Download
                  </Button>
                </a>
              </Flex>
            </Flex>
          )}
        </GridItem>
      </Grid>
      {feeds && (
        <Flex direction={"column"} width="full" my={6}>
          <Text my={4} fontSize={25} fontWeight="semibold">Recommended Video are  </Text>
          <RecemendVideo feeds={feeds} />
        </Flex>
      )}
    </Flex>
  );
};

export default VideoPinDetails;
