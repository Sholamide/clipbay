import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaCloud, FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { client } from "../utils/client";
import { SanityAssetDocument } from "@sanity/client";
import { topics } from "../utils/constants";
import { BASE_URL } from "../utils";
const Upload = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [videoAsset, setVideoAsset] = useState<
    SanityAssetDocument | undefined
  >();
  const [wrongFileType, setWrongFileType] = useState<Boolean>(false);
  const [caption, setCaption] = useState("");
  const [topic, setTopic] = useState<String>(topics[0].name);
  const [savingPost, setSavingPost] = useState<Boolean>(false);
  const userProfile: any = useAuthStore((state) => state.userProfile);
  const router = useRouter();

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];
    const fileTypes = ["video/mp4", "video/webm", "video/ogg"];

    //uploading asset to sanity
    if (fileTypes.includes(selectedFile.type)) {
      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((data) => {
          setVideoAsset(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setWrongFileType(true);
    }
  };
  const handlePost = async () => {
    if (caption && videoAsset?._id && topic) {
      setSavingPost(true);

      const document = {
        _type: "post",
        caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic,
      };
      await axios.post("http://localhost:3000/api/post", document);
      router.push("/");
    }
  };

  const handleDiscard = () => {
    setSavingPost(false);
    setVideoAsset(undefined);
    setCaption("");
    setTopic("");
  };
  return (
    <div className="flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[#f8f8f8] justify-center">
      <div className="bg-white rounded-lg w-[60%] xl:h-[80vh] flex gap-6 flex-wrap justify-between items-center p-14 pt-6">
        <div>
          <div>
            <p className="text-2xl font-bold">Upload Video</p>
            <p className="text-md text-gray-400 mt-1">
              Post a video to your account
            </p>
          </div>
          <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col  justify-center items-center  outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100">
            {loading ? (
              <p>Uploading...</p>
            ) : (
              <div>
                {videoAsset ? (
                  <div>
                    <video
                      src={videoAsset?.url}
                      loop
                      controls
                      className="rounded-xl h-[462px] mt-16 bg-black "
                    />
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col items-center justify-center ">
                        <p className="font-bold text-xl">
                          <FaCloudUploadAlt className="text-6xl text-gray-300" />
                        </p>
                        <p className="text-xl font-semibold">Upload Video</p>
                      </div>
                      <p className="text-gray-400 text-center mt-10 text-sm leading-6">
                        MP4 or WebM or ogg <br />
                        720X1280 or higher
                        <br />
                        up to 10 minutes
                        <br />
                        Less than 2GB
                      </p>
                      <p className="bg-[#F51957] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none">
                        Select File
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={uploadVideo}
                      name="upload-video "
                      className="w-0 h-0"
                    />
                  </label>
                )}
              </div>
            )}
            {wrongFileType && (
              <p className="text-center text-sm text-red-400 font-semibold mt-4 w-[250px] px-2">
                Please select the right file format
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 pb-10">
          <label className="text-md font-medium">Caption</label>
          <input
            className="outline-none text-md rounded-lg border-2 p-2 border-gray-200"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <label className="text-md font-medium">Choose a Category</label>
          <select
            className="border-2 border-gray-200 rounded-lg outline-none text-md capitalize lg:p-4 p-2"
            onChange={(e) => setTopic(e.target.value)}
          >
            {topics.map((topic) => (
              <option
                key={topic.name}
                className="bg-white hover:bg-slate-300 p-2 text-gray-700 text-md outline-none capitalize"
                value={topic.name}
              >
                {topic.name}
              </option>
            ))}
          </select>
          <div className="flex gap-6 mt-10">
            <button
              type="button"
              onClick={handleDiscard}
              className="border-gray-300 rounded-lg text-md font-medium w-28 lg:w-44 outline-none border-2 p-2"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handlePost}
              className=" bg-[#f51997] rounded-lg text-md font-medium w-28 lg:w-44 outline-none p-2 text-white"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
