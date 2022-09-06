import type { NextPage } from "next";
import axios from "axios";
import { Video } from "../types";
import VideoCard from "../components/VideoCard";
import NoResult from "../components/NoResults";
import { BASE_URL } from "../utils";

interface VideoProps {
  videos: Video[];
}

const Home = ({ videos }: VideoProps) => {
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos.map((video: Video) => (
          <VideoCard post={video} isShowingOnHome key={video._id} />
        ))
      ) : (
        <NoResult text={`No Videos`} />
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let response = await axios.get(`${BASE_URL}/api/post`);
  if (topic) {
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
  }
  return {
    props: {
      videos: response.data,
    },
  };
};
export default Home;
