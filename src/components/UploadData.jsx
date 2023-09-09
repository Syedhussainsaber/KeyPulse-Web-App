import React, { useEffect, useState} from 'react';
import { Button, Modal, Spin } from 'antd';
// import { handleUpload } from '../apis/UploadFileApi';
import {AiFillPlusCircle} from  "react-icons/ai"
// import {BiCloudUpload} from "react-icons/bi"
import { useDataAPI } from '../contexts/GetDataApi';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';



const UploadData = () => {

   // ... State and handlers ...
  const {uploadedData,handleUpload, showContent} = useDataAPI()
const [open, setOpen] = useState(false);
const [confirmLoading, setConfirmLoading] = useState(false);
const [fetchedData, setFetchedData] = useState([])
 const [file, setFile] = useState(null);
const navigate = useNavigate()


// useEffects Hooks
useEffect(()=>{
setFetchedData(uploadedData.map((item)=>{
return item.field
}))
},[uploadedData])



// Functions
const showModal = () => {
    setOpen(true);
  };

const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

const handleOk = ()=>{
    handleUpload(file)
    setOpen(false)
  }
  
const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

 
  return (
    <>
    <Navbar/>
    <div className="container">
     <div className="upload-section">
      <div className="upload-container"  onClick={showModal}>
        <AiFillPlusCircle size={45}/>
        <p>Upload Dataset</p>
      </div>
      <Modal
        title=""
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
okText="upload"
      >

        <input type='file' onChange={handleFileChange} />
    
      </Modal>

      </div>

        {/* FetchedData is map to get an JSON format of the Data */}
{
fetchedData.map((finalField,index)=>{
const finalValue = finalField ?JSON.parse(finalField):""

return uploadedData && finalValue !== "" ?<div className="csv-files" key={index} onClick={async()=>{
await showContent({ filename:finalValue.filename, headers:Object.keys(finalValue.data
  [0]), data: finalValue.data})

 // Uploaded Data is storing the localstorage  
 localStorage.setItem("filename",finalValue.filename)

  navigate("/prepare")
}}>

<img src="/dataThumbnail.jpeg" alt={finalValue.filename} width={300} className='data-img' />
<h5 className='filename'>{finalValue.filename}</h5>
</div>:<></>
  })
}
  </div>

    </>
  );
}

export default UploadData