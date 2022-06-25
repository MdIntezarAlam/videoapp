import { useState, useEffect } from "react";
import { firebaseApp } from "../firebase-config";
import { getFirestore } from "firebase/firestore";
import { categoryFeeds, getAllFeeds } from "../Utils/FetchData";
import Spinner from "../Component/Spinner";
import { SimpleGrid } from "@chakra-ui/react";
import VideoPin from "./VideoPin";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

const Feed = () => {
  // this is firebase db instance
  const firestoredb = getFirestore(firebaseApp);
  const [feeds, setFeeds] = useState(null);
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      categoryFeeds(firestoredb, categoryId).then((data) => {
        setFeeds(data);
        setLoading(false);
      });
    } else {
      getAllFeeds(firestoredb).then((data) => {
        setFeeds(data);
        setLoading(false);
      });
    }
  }, []);
  if (loading) return <Spinner msg={"Loading Your Feeds"} />;

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

export default Feed;
