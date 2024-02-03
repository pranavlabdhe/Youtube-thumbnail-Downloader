import React, { useRef } from 'react';

const ImageToWebp = () => {
  // Create refs for the images
  const uiImageRef = useRef(null);
  const wiImageRef = useRef(null);

  const convertImage = (e) => {
    if (e.target.files.length > 0) {
      const src = URL.createObjectURL(e.target.files[0]);
      uiImageRef.current.src = src;
      
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext("2d")
      let userImage = new Image();
        userImage.src  = src;
        userImage.onload = ()=> {
            canvas.width = userImage.width
            canvas.height = userImage.height
            ctx.drawImage(userImage,0,0)
            let WebpImage = canvas.toDataURL("image/webp")
            wiImageRef.current.src = WebpImage
                    
            // Create a link to download the image
            const downloadLink = document.createElement('a');
            downloadLink.href = WebpImage;
            downloadLink.download = 'converted_image.webp';

            // Append the link to the document and trigger a click
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

    }
  };

  return (
    <div>
      <h1 className='text-center m-3'>Convert JPG/PNG images to Webp format</h1>
      <div className='choose_image'>
      <input type='file' accept='image/' name='convert' id='userImage' onChange={convertImage} className='file_cursor mt-3' />
      </div>
      <h1 className='title text-center mt-3'>Upload an Image</h1>
    

    <div className='row mt-5 justify-content-center images_div'>
        <div className='col-10 col-sm-5 col-md-5 col-lg-5 d-flex justify-content-center flex-column align-items-center parent_image_div p-0' style={{marginRight:'0px'}}>
            <h2>Uploaded Image</h2>
          <img ref={uiImageRef} className='mt-3' id='UiImage' alt='Uploaded Image' />
        </div>
        <div className='col-10 col-sm-4 col-md-4 col-lg-5 d-flex justify-content-center flex-column align-items-center parent_image_div_1 p-0'style={{marginRight:'0px'}}>
            <h2>Converted Image</h2>
          <img ref={wiImageRef} className='mt-3' id='WiImage' alt='Converted Image' />
        </div>
      </div>
    </div>
   
 
  );
};

export default ImageToWebp;
