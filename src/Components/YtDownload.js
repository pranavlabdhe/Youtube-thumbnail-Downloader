
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";

const YtDownload = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [thumbNailUrls, setThumbNailUrls] = useState([
    { title: 'High Quality', url: "" },
    { title: 'Medium Quality', url: "" },
    { title: 'Standard Quality', url: "" },
    { title: 'Maximum Resolution', url: "" }
  ]);
  const [videoName, setVideoName] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [showDialog1, setShowDialog1] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);

  const handleInputChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const copyFunc = () => {
    var copyText = document.getElementById("myInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
    alert("Copied the text: " + copyText.value);
  };

  const handleDialog1Open = () => {
    setShowDialog1(true);
  };

  const handleDialog2Close = () => {
    setShowDialog1(false);
    setShowDialog2(false);
  };

  const getVideoId = () => {
    const regex1 =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+).*$/;
    const regex2 = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+).*$/;
    const match1 = videoUrl.match(regex1);
    const match2 = videoUrl.match(regex2);
    const videoId = match1 ? match1[1] : match2 ? match2[1] : null;
    setVideoId(videoId);
  };

  const handleDownloadClick = async () => {
    try {
      const thumbnailResponseHQ = await axios.get(
        `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=hqdefault`,
        { responseType: "json" }
      );

      const thumbnailResponseMQ = await axios.get(
        `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=mqdefault`,
        { responseType: "json" }
      );

      const thumbnailResponseSD = await axios.get(
        `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=sddefault`,
        { responseType: "json" }
      );

      const thumbnailResponseMaxRes = await axios.get(
        `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=maxresdefault`,
        { responseType: "json" }
      );

      setThumbNailUrls([
        {
          title: 'High Quality',
          url: `data:image/jpeg;base64,${thumbnailResponseHQ.data.thumbnail}`
        },
        {
          title: 'Medium Quality',
          url: `data:image/jpeg;base64,${thumbnailResponseMQ.data.thumbnail}`
        },
        {
          title: 'Standard Quality',
          url: `data:image/jpeg;base64,${thumbnailResponseSD.data.thumbnail}`
        },
        {
          title: 'Maximum Resolution',
          url: `data:image/jpeg;base64,${thumbnailResponseMaxRes.data.thumbnail}`
        }
      ]);

      setShowContent(true);
      setVideoName(thumbnailResponseHQ.data.videoTitle);
    } catch (error) {
      console.error("Error while fetching video data", error);
      if (error.response && error.response.status === 500) {
        var maxres1 = "maxres1";
        const thumbnailResponseMaxRes = await axios.get(
          `http://localhost:3001/fetch-thumbnail?videoId=${videoId}&quality=${maxres1}`,
          { responseType: "json" }
        );
        setThumbNailUrls([
          {
            title: 'Maximum Resolution',
            url: `data:image/jpeg;base64,${thumbnailResponseMaxRes.data.thumbnail}`
          }
        ]);
        setShowContent(true);
      }
    }
  };

  const handleImageDownload = () => {
    setShowDialog1(false);
    setShowDialog2(true);
    if (selectedThumbnail !== null) {
      const url = thumbNailUrls[selectedThumbnail].url;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("download", "thumbnail.jpg");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    getVideoId();
  }, [videoUrl, videoId, videoName]);

  return (
    <div className="p-3">
      <h1>YouTube Thumbnail Download</h1>
      <label className="col-12">
        Enter YouTube Video URL
        <input
          type="text"
          value={videoUrl}
          onChange={handleInputChange}
          className="form-control col-12"
        />
      </label>
      <div className="d-flex w-100 justify-content-center p-4">
        <button onClick={handleDownloadClick}>Get Thumbnail</button>
      </div>

      {thumbNailUrls && (
        <div className="">
          {showContent ? (
            <div className="d-flex justify-content-center">
              <div className="col-12 col-sm-5 col-md-5 col-lg-5">
                <div className="col">
                  <div>
                    <img
                      src={thumbNailUrls[selectedThumbnail].url}
                      className="img-fluid w-100"
                      alt="Thumbnail"
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
                        onClick={handleDialog1Open}
                      >
                        Download Image
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <Modal show={showDialog1} onHide={handleDialog2Close}>
                    <Modal.Header closeButton>
                      <Modal.Title>{videoName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal_body_padding">
                      <div className="pt-2">
                        <ul className="list-group">
                          {thumbNailUrls.map((t, index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex justify-content-between list_bottom_border input-group"
                            >
                              <label
                                htmlFor={index}
                                className="d-flex justify-content-between list_bottom_border input-group"
                              >
                                <div>{t.title}</div>
                                <div>
                                  <input
                                    className="form-check-input me-3"
                                    type="radio"
                                    name="thumbnail"
                                    id={index}
                                    onChange={() => setSelectedThumbnail(index)}
                                    checked={selectedThumbnail === index}
                                  />
                                </div>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" onClick={handleImageDownload}>
                        Download Image
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
                <div>
                  <Modal show={showDialog2} onHide={handleDialog2Close}>
                    <Modal.Header closeButton>
                      <Modal.Title>Support Us</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="body_padding">
                      <Form.Control
                        size="lg"
                        type="text"
                        id="myInput"
                        value="www.example.com"
                        readOnly
                      />
                      <div className="d-flex justify-content-center support_btn p-3">
                        <Button variant="outline-light outline_support" onClick={copyFunc}>
                          I'll do this later
                        </Button>
                        <Button className="btn btn-dark" onClick={copyFunc}>
                          Copy
                        </Button>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleDialog2Close}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleDialog2Close}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
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

