import { Flex, Image, Text } from "@chakra-ui/react";


const notFoindSvg ="https://thumbs.dreamstime.com/z/man-pc-sitting-home-page-not-found-error-error-concept-vector-illustration-sorry-man-standing-near-page-not-found-125909629.jpg"

const NotFound = () => {
  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      width={"full"}
    >
      <Image src={notFoindSvg} width={600} />
      <Text fontSize={40} fontWeight="semibold">Not Found</Text>
    </Flex>
  );
};

export default NotFound;
