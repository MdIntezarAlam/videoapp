import { firebaseApp } from '../firebase-config'
//prettier-ignore
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
//fetch all docs from firebase db
export const getAllFeeds = async (firestoredb) => {
  const feeds = await getDocs(query(
    collection(firestoredb, 'videos'), orderBy("id", "desc")
  ));
  return feeds.docs.map((doc) => doc.data());
};

// category wise feeds
export const categoryFeeds = async (firestoredb, categoryId) => {
  const feeds = await getDocs(query(
    collection(firestoredb, 'videos'),
    where("category", " == ", categoryId),
    orderBy("id", "desc")
  ));
  return feeds.docs.map((doc) => doc.data());
};


// get all the recommended videos feeds from  firebaase
export const recommendedFeed = async (firestoredb, categoryId, videoId) => {
  const feeds = await getDocs(query(
    collection(firestoredb, 'videos'),
    where("category", " == ", categoryId),
    where("id", "!=", videoId),
    orderBy("id", "desc")
  ));
  return feeds.docs.map((doc) => doc.data());
};


// fetech the infor  from user userid from firebse db
export const getUserInfo = async (firestoredb, userId) => {
  const userRef = doc(firestoredb, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data()
  } else {
    return 'There is no such Documents';
  }
}

// Fetch the specific video
export const getSpecificVideo = async (firestoredb, videoId) => {
  const videoRef = doc(firestoredb, "videos", videoId);

  const videoSnap = await getDoc(videoRef);
  if (videoSnap.exists()) {
    return videoSnap.data()
  } else {
    return 'There is no such Documents';
  }
}

export const deleteVideo = async (firestoredb, videoId) => {
  await deleteDoc(doc(firestoredb, videoId))
}


//user uploaded videos
export const userUploadedVideos = async (firestoredb, userId) => {
  const feeds = await getDocs(query(
    collection(firestoredb, 'videos'), where('userId', '==', userId), orderBy("id", "desc")
  ));
  return feeds.docs.map((doc) => doc.data());
};
