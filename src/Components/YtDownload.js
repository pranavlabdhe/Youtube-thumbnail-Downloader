import React, { useEffect, useState } from "react";
import axios from "axios";
const YtDownload = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [thumbNailUrls, setThumbNailUrls] = useState([
    {
        title: 'High Quality',
        url: "",
      },
      {
        title: 'Medium Quality',
        url: "",
      },
      {
        title: 'Standard Quality',
        url: "",
      },
      {
        title: 'Maximum Resolution',
        url: "",
      },
  ]);
  const [videoName, setVideoName] = useState("ss");
  const [showContent, setContent] = useState(false);
  const [selectedThumbnail, setSelectedThumbNail] = useState(null)
  const handleInputChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const getVideoId = () => {
    const regex1 =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+).*$/;
    // Pattern for the second URL format
    const regex2 = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+).*$/;
    // Try to match the URL against the patterns
    const match1 = videoUrl.match(regex1);
    const match2 = videoUrl.match(regex2);

    // Extract the video ID based on the matched pattern
    const videoId = match1 ? match1[1] : match2 ? match2[1] : null;
    setVideoId(videoId);
    // console.log(videoId);
  };

  const handleDownloadClick = async () => {
    try {
      let hqdefault = "hqdefault";
      let mqdefault = "mqdefault";
      let sddefault = "sddefault";
      let maxresdefault = "maxresdefault";

      var thumbnailResponseHQ = await axios.get(
        `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=${hqdefault}`,
        {
          responseType: "json",
        }
      );

      var thumbnailResponseMQ = await axios.get(
        `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=${mqdefault}`,
        {
          responseType: "json",
        }
      );

      var thumbnailResponseSD = await axios.get(
        `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=${sddefault}`,
        {
          responseType: "json",
        }
      );

      var thumbnailResponseMaxRes = await axios.get(
        `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=${maxresdefault}`,
        {
          responseType: "json",
        }
      );

      setContent(true);
      setVideoName(thumbnailResponseHQ.data.videoTitle);
    } catch (error) {
      console.error("Error while fetching video data", error);
      if (error.response.status === 500) {
        var maxres1 = "maxres1";
        thumbnailResponseMaxRes = await axios.get(
          `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=${maxres1}`,
          {
            responseType: "json",
          }
        );
        setContent(true);
      }
    }
    // setThumbNailUrls({
    //   hqdefault: `data:image/jpeg;base64,${thumbnailResponseHQ.data.thumbnail}`,
    //   mqdefault: `data:image/jpeg;base64,${thumbnailResponseMQ.data.thumbnail}`,
    //   sddefault: `data:image/jpeg;base64,${thumbnailResponseSD.data.thumbnail}`,
    //   maxresdefault: `data:image/jpeg;base64,${thumbnailResponseMaxRes.data.thumbnail}`,
    // });
    thumbNailUrls[0].url = `data:image/jpeg;base64,${thumbnailResponseHQ.data.thumbnail}`
    thumbNailUrls[1].url = `data:image/jpeg;base64,${thumbnailResponseMQ.data.thumbnail}`
    thumbNailUrls[2].url = `data:image/jpeg;base64,${thumbnailResponseSD.data.thumbnail}`
    thumbNailUrls[3].url = `data:image/jpeg;base64,${thumbnailResponseMaxRes.data.thumbnail}` 
    setThumbNailUrls([...thumbNailUrls])
    console.log(thumbnailResponseHQ.data.videoTitle);
    setVideoName(thumbnailResponseHQ.data.videoTitle);
  };

  const handleImageDownload = () => {
    if(selectedThumbnail !== null) {
    const url =thumbNailUrls[selectedThumbnail].url
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("target", "_blank");
    link.setAttribute("download", "thumbnail.jpg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    };
    console.log(selectedThumbnail);
  }
  useEffect(() => {
    getVideoId();
    console.log(thumbNailUrls);
  }, [videoUrl, videoId, videoName]);

  return (
    <div className="p-3">
      <h1>Yt Thumbail Download</h1>
      <label className="col-12">
        Enter Youtube Video URL
        <input
          type="text"
          value={videoUrl}
          onChange={handleInputChange}
          className="form-control col-12"
        />
      </label>
      <div className="d-flex w-100 justify-content-center p-4">
        <button onClick={handleDownloadClick}>Get Thumbail</button>
      </div>

      {thumbNailUrls && (
        <div className="">
          {showContent ? (
            <div className="d-flex justify-content-center">
              <div className="col-12 col-sm-5 col-md-5 col-lg-5">
                <div className="col">
                  <div>
                    <img
                      src={thumbNailUrls[0].url}
                      className="img-fluid w-100"
                      alt="High quality Default resolution"
                    />

                  </div>
                  <div className="image_details">
                    <div>
                      <p>{videoName}</p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Download Image
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  {/* <!-- Modal --> */}
                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="p-4">
                          <h1
                            className="modal-title text-center fs-5"
                            id="exampleModalLabel"
                          >
                            {videoName}
                          </h1>
                        </div>
                        <div className="">
                          <ul className="list-group">
                              <div className="">
                                {thumbNailUrls.map((t,index)=> {
                                    return (
                                        <div key={index} className="d-flex justify-content-between list_bottom_border input-group">
                                            <div>
                                             <li className="list-group-item">
                                                 {t.title}
                                            </li>
                                            </div>
                                            <div>
                                            <input class="form-check-input me-3" type="radio" name="flexRadioDefault" id={index}
                                            onChange={()=>setSelectedThumbNail(index)}
                                            checked = {selectedThumbnail === index}
                                            ></input>
                                            </div>
                                            </div>
                                    );
                                })}
                              </div>
                          </ul>
                        </div>
                        <div className="d-flex p-3 justify-content-center">
                          <button type="button" className="btn btn-primary" onClick={handleImageDownload}>
                            Download Image
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default YtDownload;
