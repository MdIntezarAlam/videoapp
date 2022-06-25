import React, { useEffect } from "react";
import { Flex, Text, Progress } from "@chakra-ui/react";
import { Circles } from "react-loader-spinner";

const Spinner = ({ msg, progres }) => {
  useEffect(() => {}, [progres]);

  return (
    <Flex
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"full"}
      px={10}
    >
      <Circles color="#000FFF" height={80} width={100} />
      <Text fontSize={25} textAlign="center" px={2}>
        {msg}
      </Text>

      {/* this is Progres bar */}
      {progres && (
        <Progress
          mt={50}
          hasStripe
          isAnimated
          size="sm"
          value={Number.parseInt(progres)}
          width={"lg"}
          rounded="sm"
          colorScheme={"linkedin"}
        />
      )}
    </Flex>
  );
};

export default Spinner;
