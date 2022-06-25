//prettier-ignore
import {useEffect, useState,useRef} from "react";
import { fetchUser } from "../Utils/Fetchuser";
import { firebaseApp } from "../firebase-config";
import { useNavigate } from "react-router";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import {
  Button,
  Flex,
  Input,
  InputLeftElement,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  FormLabel,
} from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";
import {
  IoCheckmark,
  IoLocationSharp,
  IoTrash,
  IoWarning,
} from "react-icons/io5";
import { FaCloudUploadAlt, FaDownload } from "react-icons/fa";
import { IoChevronDownSharp } from "react-icons/io5";
import { categories } from "../data";
import Spinner from "./Spinner";
// prettier-ignore
import {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage'
// import { useEffect } from "react";
import AlertMsg from "./AlertMsg";
// import { async } from "@firebase/util";

const Create = () => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.50");

  // this is editior
  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Select a Category");
  const [location, setLocation] = useState("Location");
  const [videoAssets, setVideoAssets] = useState(null);
  const [loading, setLoading] = useState(false); //should be false
  const [progres, setProgres] = useState(1);
  const [alert, setAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlerMsg] = useState("");
  const [alerIcon, setAlerIcon] = useState(null);
  const [description, setDeacription] = useState("");

  const [userInfo] = fetchUser();
  const navigate = useNavigate();

  const storage = getStorage(firebaseApp);
  const firebasedb = getFirestore(firebaseApp);

  // this is  for  uploading video functions
  const uploadImage = (e) => {
    setLoading(true);
    const videoFile = e.target.files[0];
    const storageRef = ref(storage, `videos/${Date.now()}-${videoFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on(
      "state_changed",
      (snapshort) => {
        const uploadProgres =
          (snapshort.bytesTransferred / snapshort.totalBytes) * 100;
        setProgres(uploadProgres);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoAssets(downloadURL);
          setLoading(false);
          setAlert(true);
          setAlertStatus("success");
          setAlerIcon(<IoCheckmark fontSize={20} />);
          setAlerMsg("Your video is uploaded to our server");
          setTimeout(() => {
            setAlert(false);
          }, 4000);
        });
      }
    );
  };

  // this function for deteting images
  const delelctImage = () => {
    const deleteRef = ref(storage, videoAssets);
    deleteObject(deleteRef)
      .then(() => {
        setVideoAssets(null);
        setAlert(true);
        setAlertStatus("errors");
        setAlerIcon(<IoWarning fontSize={10} />);
        setAlerMsg("Your video was deleted from our server");
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // this is editor functions
  const getDescriptionValue = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      setDeacription(editorRef.current.getContent());
    }
  };

  // this is uploading  details functions
  const uploadDetails = async () => {
    try {
      setLoading(true);
      if (!title && !category && !videoAssets) {
        setAlert(true);
        setAlertStatus("errors");
        setAlerIcon(<IoWarning fontSize={10} />);
        setAlerMsg("Required field are  missing");
        setTimeout(() => {
          setAlert(false);
        }, 4000);
        setLoading(false);
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          userId: userInfo?.uid,
          category: category,
          location: location,
          videoUrl: videoAssets,
          description: description,
        };
        await setDoc(doc(firebasedb, "videos", `${Date.now()}`), data);
        setLoading(false);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {}, [title, location, description, category]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems="center"
      width={"full"}
      minHeight="100vh"
      padding={10}
    >
      <Flex
        width={"80%"}
        height="full"
        border={"1px"}
        borderColor="gray.300"
        borderRadius={"md"}
        p="4"
        flexDirection={"column"}
        alignItems="center"
        justifyContent={"center"}
        gap={2}
      >
        {/* this is Alert */}
        {alert && (
          <AlertMsg status={alertStatus} msg={alertMsg} icon={alerIcon} />
        )}
        <Input
          variant={"flushed"}
          placeholder="Title"
          focusBorderColor="gray.500"
          errorBorderColor="gray"
          type={"text"}
          _placeholder={{ color: "gray" }}
          fontSize="22px"
          value={title}
          mt={4}
          onChange={(e) => setTitle(e.target.value)}
        ></Input>
        <Flex
          justifyContent={"space-between"}
          alignItems="center"
          width={"full"}
          gap={8}
          my={4}
        >
          <Menu>
            <MenuButton
              width={"full"}
              colorScheme="blue"
              as={Button}
              rightIcon={<IoChevronDownSharp fontSize={20} />}
            >
              {category}
            </MenuButton>
            <MenuList zIndex={101} width={"md"} shadow="xl">
              {categories &&
                categories.map((data) => (
                  <MenuItem
                    key={data.id}
                    _hover={{ bg: "blackAlpha.300" }}
                    fontSize={20}
                    height={"4.78vh"}
                    px={5}
                    onClick={() => setCategory(data.name)}
                  >
                    {data.iconSrc}{" "}
                    <Text fontSize={18} marginLeft={4}>
                      {data.name}
                    </Text>
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <InputGroup>
            <InputLeftElement
              children={IoLocationSharp}
              fontSize={20}
              color={`${colorMode == "dark" ? "#f1f1f1" : "#111"} `}
            />
            <Input
              variant={"flushed"}
              placeholder={location}
              focusBorderColor="gray.400"
              errorBorderColor="red"
              type={"text"}
              _placeholder={{ color: "gray" }}
              fontSize="20px"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </InputGroup>
        </Flex>

        {/* this is selesctions */}
        <Flex
          border={"1px"}
          borderColor="gray.500"
          height={"400px"}
          width="full"
          overflow="hidden"
          borderStyle="dashed"
          position={"relative"}
        >
          {!videoAssets ? (
            <FormLabel width="full">
              <Flex
                direction={"column"}
                alignItems="center"
                justifyContent={"center"}
                width="full"
                height={"full"}
              >
                <Flex
                  direction={"column"}
                  alignItems="center"
                  justifyContent={"center"}
                  width="full"
                  height={"full"}
                  cursor="pointer"
                >
                  {loading ? (
                    <>
                      <Spinner msg={"Upload Your Video"} progres={progres} />{" "}
                    </>
                  ) : (
                    <>
                      <FaCloudUploadAlt
                        fontSize={30}
                        color={`${colorMode == "dark" ? "#f1f1f1" : "#111"}`}
                      />
                      <Text mt={5} fontSize={20} color={textColor}>
                        Click to Upload
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>

              {!loading && (
                <input
                  type={"file"}
                  name="upload-image"
                  onChange={uploadImage}
                  style={{ width: 0, height: 0 }}
                  accept="video/mp4,video/x-m4v,video/*"
                />
              )}
            </FormLabel>
          ) : (
            <Flex
              width={"full"}
              height={"full"}
              justifyContent={"center"}
              alignItems={"center"}
              bg="black"
              position={"relative"}
            >
              <Flex
                width={"40px"}
                height={"40px"}
                rounded="full"
                bg={"red"}
                top={5}
                right={5}
                position={"absolute"}
                cursor={"pointer"}
                justifyContent={"center"}
                alignItems={"center"}
                zIndex={10}
                onClick={delelctImage}
              >
                <IoTrash fontSize={20} color="white" />
              </Flex>

              <video
                src={videoAssets}
                controls
                style={{ width: "100%", height: "100%" }}
              />
            </Flex>
          )}
        </Flex>
        {/* this is editior code */}

        <Editor
          // tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
          onChange={getDescriptionValue}
          onInit={(evt, editor) => (editorRef.current = editor)}
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
          init={{
            height: 500,
            width: "100%",
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "preview",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            skin: "oxide-dark",
          }}
        />
        <Button
          isLoading={loading}
          loadingText="uploading"
          colorScheme={"linkedin"}
          variant={`${loading ? "outline" : "solid"}`}
          width={"sm"}
          _hover={{ shadow: "lg" }}
          fontSize={20}
          cursor="pointer"
          onClick={() => uploadDetails()}
        >
          Upload
        </Button>
        {/* end */}
      </Flex>
    </Flex>
  );
};

export default Create;
