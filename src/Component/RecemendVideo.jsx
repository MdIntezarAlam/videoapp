import { useState, useEffect } from "react";
import { getAllFeeds } from "../Utils/FetchData";
import { SimpleGrid } from "@chakra-ui/react";
import VideoPin from "./VideoPin";


const RecemendVideo = ({ feeds }) => {
  return (  
    <SimpleGrid
      minChildWidth="300px"
      autoColumns={"max-content"}
      spacing="15px"
      px="2"
      width={"full"}
      overflow="hidden"
    >
      {feeds &&
        feeds.map((data) => (
          <VideoPin key={data.id} maxWidth={420} height="80px" data={data} />
        ))}
    </SimpleGrid>
  );
};

export default RecemendVideo;
