
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import lang from "../utils/languageConstant";
import { SUPPORTED_LANGUAGES } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../utils/configSlice";
const YtDownload = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [thumbNailUrls, setThumbNailUrls] = useState([
    { title: 'Maximum Resolution (1280x720)', url: "" },  
    { title: 'High Quality (480x360)', url: "" },
    { title: 'Medium Quality (320x180)', url: "" },
    { title: 'Standard Quality (640x480) ', url: "" },

  ]);
  const [videoName, setVideoName] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [showDialog1, setShowDialog1] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  const [showCopyAlert,  setCopyAlert] = useState(false)
  const dispatch = useDispatch()
  const langKey = useSelector(store=> store.config.lang)  


  const handleInputChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const copyFunc = () => {
    var copyText = document.getElementById("myInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
    setCopyAlert(true)
    setTimeout(()=>{
      setCopyAlert(false)
    },2000)
    // alert("Copied the text: " + copyText.value);
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
          title: 'Maximum Resolution (1280x720)',
          url: `data:image/jpeg;base64,${thumbnailResponseMaxRes.data.thumbnail}`
        },
        {
          title: 'High Quality (480x360) ',
          url: `data:image/jpeg;base64,${thumbnailResponseHQ.data.thumbnail}`
        },
        {
          title: 'Medium Quality (320x180)',
          url: `data:image/jpeg;base64,${thumbnailResponseMQ.data.thumbnail}`
        },
        {
          title: 'Standard Quality (640x480)',
          url: `data:image/jpeg;base64,${thumbnailResponseSD.data.thumbnail}`
        },
      
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

  const handleLanguageChange = (e) => {
      // console.log(e.target.value);
      dispatch(changeLanguage(e.target.value))
  }
  useEffect(() => {
    getVideoId();
    
  }, [videoUrl, videoId, videoName]);

  return (
    <div className="">
      <nav className="navbar navbar-expand-lg navbar_background">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">
    {/* <img src="https://cdn.pixabay.com/photo/2017/03/16/21/18/logo-2150297_640.png" alt="Logo" width="30" height="24" className="d-inline-block align-text-top"/> */}
     {/* <span className="logo ms-4">iyoutubethumnail</span>  */}
     <img src="images/logo.svg" />
      </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse " id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <Form.Select aria-label="Default select example" className="form-control select_border" onChange={handleLanguageChange}>
      {SUPPORTED_LANGUAGES.map(lang=> <>
        <option value= {lang.identifier}>{lang.name}</option><hr/>
        </> ) }
   <hr/>
    </Form.Select>
      </ul>
    </div>
  </div>
</nav>
<div className="main ">

<div className="col-12 d-flex justify-content-center ">
  <div className="col-12 col-sm-6 col-md-6 col-lg-6 d-flex flex-column align-items-center justify-content-center font_styles color_blur">
    <p className="text-black poppins-medium m-0 mobile_text">{lang[langKey].tagline1}</p>
    <p className="gradient-text poppins-medium mobile_text">{lang[langKey].tagline2}</p>
  </div>
</div>

<div className="col-12 d-flex justify-content-center pt-5">
  <div className="col-12 col-sm-10 col-md-10 col-lg-6 position-relative ">
  <input
          type="text"
          value={videoUrl}
          onChange={handleInputChange}
          className="form-control form_border_radius"
          placeholder={lang[langKey].searchPlaceHolder}
        />
        <button onClick={handleDownloadClick} className="Search_thumnail">{lang[langKey].searchBtn}</button>
 
  </div>
</div>

{thumbNailUrls && (
  <>
    {showContent && (
      <div className="col-12 d-flex justify-content-center mt-4">
        <div className="d-flex col-12 col-sm-8 col-md-6 col-lg-6 res_div content_res_div justify-content-center">
          <img
            src={thumbNailUrls[selectedThumbnail].url}
            className="col-12 col-sm-12 col-md-12 col-lg-6"
            alt="Thumbnail"
          />

          <div className="col-12 col-sm-12 col-md-12 col-lg-6 desc_sec">
            <p className="video_desc">{videoName}</p>
            <div className="margin_bottom_get_thumbnail">
              <button
                type="button"
                className="get_thumnail mt-4"
                onClick={handleDialog1Open}
              >
                {lang[langKey].getThumbNailBtn}
              </button>
            </div>
            <p className="multi_res">
              <img
                src="images/resolution.svg"
                className="multi_res_img"
                alt="Multiple resolutions available"
              />{" "}
                {lang[langKey].multiRes}
            </p>
          </div>
        </div>
      </div>
    )}

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
                    <div className="mb-3">{t.title}</div>
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
          <Button variant="primary" onClick={handleImageDownload} className="download_thumbnail">
            Download Image
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

    <div className="support_btn">
      <Modal show={showDialog2} onHide={handleDialog2Close}>
        <Modal.Header closeButton cla> 
          <Modal.Title>Was this helpful?</Modal.Title>

        </Modal.Header>
        <p className="support_tag_line ms-4 mt-4">Help us grow by sharing the link with your friends</p>
        <Modal.Body className="body_padding">
          <Form.Control
            size="lg"
            type="text"
            id="myInput"
            value="www.iyoutubethumbnail.com"
            className="read_only_form"
            readOnly
          />
          <div className="d-flex justify-content-center  p-3">
         
            <button onClick={copyFunc} className="copy_thumnail" >Copy Link</button>

          </div>
          { 
            showCopyAlert &&  <div class="alert alert-success" role="alert">
            Link copied
            </div>
            }
          
        </Modal.Body>
      </Modal>
    </div>
  </>
)}




<div className="parent_box_0">
      <div className="col-12 col-sm-4 col-md-3 col-lg-3 d-flex justify-content-center flex-column align-items-center feature_text">
        <img src="images/free.svg"/>
        <p className="features mt-3">{lang[langKey].freeDownloads}</p>
      </div>
      <div className="col-12 col-sm-4 col-md-3 col-lg-3 d-flex justify-content-center flex-column align-items-center feature_text">
        <img src="images/40_res.svg" />
        <p className="features mt-3">{lang[langKey].MultipleRes}</p>
      </div>
      <div className="col-12 col-sm-4 col-md-3 col-lg-3 d-flex justify-content-center flex-column align-items-center feature_text">
        <img src="images/unlimited.svg" />
        <p className="features text-center mt-2">{lang[langKey].UnlinmitedDownloads}</p>
      </div>
    </div>
    <p className="hit_works_text">{lang[langKey].howItWorks}</p>
    <div className="parent_box">
      <div className="col-12 col-sm-4 col-md-3 col-lg-3 box_borders">
        <img src="images/copy.svg" />
        <p className="cpy_link mt-2">{lang[langKey].copyYoutubeLink}</p>
        <p className="desc_text">{lang[langKey].copyYoutubeLinkDesc}</p>
      </div>
      <div className="col-12 col-sm-4 col-md-3 col-lg-3 box_borders">
        <img src="images/copy_2.svg" />
        <p className="cpy_link mt-2">{lang[langKey].generateThumbnail}</p>
        <p className="desc_text">{lang[langKey].generateThumbnailDesc}</p>
      </div>
      <div className="col-12 col-sm-4 col-md-3 col-lg-3 box_borders">
        <img src="images/copy_3.svg" />
        <p className="cpy_link mt-2">{lang[langKey].downloadThumbnail}</p>
        <p className="desc_text">{lang[langKey].downloadThumbnailDesc}</p>
      </div>

   

    </div>
 

 {/* <div className="col-12 d-flex justify-content-center margin_100">
  <div className="col-12 col-sm-8 col-md-8 col-lg-8">
    <p className="faq_text">{lang[langKey].faqs}</p>
    <div class="accordion mt-5 accordion-flush" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingOne">
      <button class="accordion-button faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          {lang[langKey].question1}
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question1Con}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingTwo">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
      {lang[langKey].question2}
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question2Con}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingThree">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
      {lang[langKey].question3}
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question3Con}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingFour">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
      {lang[langKey].question4}
      </button>
    </h2>
    <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question4Con}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingFive">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
      {lang[langKey].question5}
      </button>
    </h2>
    <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question5Con}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingSix">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
      {lang[langKey].question6}
      </button>
    </h2>
    <div id="collapseSix" class="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question6Con}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingSeven">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
      {lang[langKey].question7}
      </button>
    </h2>
    <div id="collapseSeven" class="accordion-collapse collapse" aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question7Con}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingEight">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
      {lang[langKey].question8}
      </button>
    </h2>
    <div id="collapseEight" class="accordion-collapse collapse" aria-labelledby="headingEight" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question8Con}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingNine">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
      {lang[langKey].question9}
      </button>
    </h2>
    <div id="collapseNine" class="accordion-collapse collapse" aria-labelledby="headingNine" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question9Con}
     
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingTen">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
      {lang[langKey].question10}
      </button>
    </h2>
    <div id="collapseTen" class="accordion-collapse collapse" aria-labelledby="headingTen" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
      {lang[langKey].question10Con}

      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header faq_acc" id="flush-headingEleven">
      <button class="accordion-button collapsed faq_acc_btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEleven" aria-expanded="false" aria-controls="collapseEleven">
      {lang[langKey].question11}
      </button>
    </h2>
    <div id="collapseEleven" class="accordion-collapse collapse" aria-labelledby="headingEleven" data-bs-parent="#accordionExample">
      <div class="accordion-body faq_acc_body">
            {lang[langKey].question11Con}
      </div>
    </div>
  </div>
</div>
</div>
</div> */}
</div>

   
  <div className="footer_bg col-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-center">
    <div className="d-flex col-8 justify-content-between mobile_footer align-items-end">
        <div className="ol-12 col-sm-6 col-md-6 col-lg-6"> 
          {/* <p className="footer_text m-0 mt-5">{lang[langKey].websitename}</p> */}
          <div className="mt-2"><img src="images/logo.svg" /></div>
          <a href="mailto:someone@example.com" className="assestive pb-4 text-decoration-none">
          <img src="images/email.svg" className="me-3"/>{lang[langKey].webSiteEmail}</a>
          <div className="love_india">
          <img src="images/love_india.svg" className="love_india" alt="made with love in india" />
          </div>
        </div>
       
        <div>

        </div>
        <div className="col-12 col-sm-6 col-md-6 col-lg-6 d-flex flex-column justify-content-end footer_margin">
          <a href="#" target="_blank" className="links" ><p className="extra_small">{lang[langKey].rights}</p> </a>
          <a href="#" target="_blank" className="links"> <p className="extra_small">{lang[langKey].termAndCon}</p></a> 
          <a href="#" target="_blank" className="links"><p className="extra_small">{lang[langKey].privacy}</p></a>  
        </div>
        
        </div>
    </div>   
<div className="gradient_strip"></div>

    </div>
  );
};

export default YtDownload;

