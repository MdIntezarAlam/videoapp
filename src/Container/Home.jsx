import React from "react";
import Navbar from "../Component/Navbar";
import { Flex } from "@chakra-ui/react";
import { Category, Create, Feed, Search, UserProfile, VideoPin } from "../Component";
import { Routes, Route } from "react-router-dom";
import { categories } from "../data";
import VideoPinDetails from "../Component/VideoPinDetails";


const Home = ({ user }) => {

  return (    
    <>
      <Navbar user={user} />
      <Flex width={"100vw"}>
        <Flex
          direction={"column"}
          justifyContent="start"
          alignItems={"center"}
          width="5%"
        >
          {/* This is Category Components */}
          {categories &&
            categories.map((data) => <Category key={data.id} data={data} />)}
          {/* here is end of Category Components */}
        </Flex>
        <Flex
          width={"95%"}
          px={4}
          justifyContent='center'
          alignContent={'center'}
          // this is optional css
          // marginLeft={"5px"}
          // height={"100vh"}
          // borderRadius="10px"
          // backgroundColor={"whatsapp.500"}
         >
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/category/:categoryId" element={<Feed />} />
            <Route path="/create" element={<Create />} />
            <Route path="/videoDetails/:videoId" element={<VideoPinDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/userDetail/:userId" element={<UserProfile />} />
          </Routes>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
