import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import Navbar from './Navbar'
import BarGraph from './BarGraph'
import { useDataAPI } from '../contexts/GetDataApi'
import EndPopup from './EndPopup'
import { Button } from '@mui/material'
import { Spin, Modal,Input,Progress} from 'antd'
import {AiOutlineClear} from "react-icons/ai"


const DisplayData = () => {


const [data, setData] = useState([])
const [headers, setHeaders] = useState([])
const [hoveredRowIndex, setHoveredRowIndex] = useState(-1);
const [displaypopup, setDisplaypopup] = useState(false)
const [valuesArray, setValuesArray] = useState([])
const [loading, setLoading] = useState(false)
const [popup, setPopup] = useState(displaypopup)
const [prepData, setPrepData] = useState("")
const [filename, setFilename] = useState("")
const [displayData, setDisplayData] = useState({})
// const [file, setFile] = useState(null)

const navigate = useNavigate()

// Data Prep States
const [open, setOpen] = useState(false);
const [confirmLoading, setConfirmLoading] = useState(false);
const [modalText, setModalText] = useState('Content of the modal');
const [arr,setArr] = useState([])

const {
 displayPopupFun,
 displayContent,
 handleCleanData,
 handlePrepareData,
 files
}  = useDataAPI()

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

function count(arr, value){
 return arr.reduce((count,currtElm)=>{
  if(value ===  currtElm){
    count++
  }
  return count
},0)
}
// const barChartData = [

//   // Add more data as needed
// ];

// Data Prep Modal Functions
const showModal = () => {
  setOpen(true);
};
const handleOk = async() => {
  // setModalText('The modal will be closed after two seconds');
  // setPrepData(e.)
  setConfirmLoading(true)
await handlePrepareData(prepData)
setTimeout(()=>{
  setConfirmLoading(false)
},2000)
  setOpen(false)

 
};
const handleCancel = () => {
  console.log('Clicked cancel button');
  setOpen(false);
};

const handleEvent= (e)=>{
setPrepData(e.target.value)
}

const handleRowHover = (index) => {
  setHoveredRowIndex(index);
};

const convertToCSV = (data,headers) => {
  const csvContent = [];
  const header = Object.keys(data[0]);
  csvContent.push(headers.join(','));

  data.forEach((item) => {
      const row = header.map((key) => item[key]);
      csvContent.push(row.join(','));
  });

  return csvContent.join('\n');
};

const downloadCSV = () => {
const filteredData = data.map((field)=>{
return headers.map((header)=>{
return field[header]
})
  })

  const csvData = convertToCSV(filteredData,headers);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'data.csv';

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};



  useEffect(()=>{
setLoading(true)
  setHeaders(displayContent.headers)
  setData(displayContent.data)
  setFilename(localStorage.getItem("filename"))

console.log(loading)
setTimeout(()=>{
setLoading(false)
},2000)

  },[displayContent])

useEffect(()=>{
setPopup(displaypopup)
},[displaypopup])

useEffect(()=>{

},[])


  return (
    <>
    <Navbar/>   
    <div className="professional-table">
    <div className="file-details">
      <img src="/keyPulse.png" onClick={()=>{
navigate("/")
      }}  style={{cursor:"pointer"}} alt="KeyPulse" width={150} height={65} />
      <p>{filename}</p>
      <p>{data.length} rows</p>
      <p>{headers.length} columns</p>
     
    </div>
<div className="filterData">

<Button variant="outlined" onClick={()=>{
  showModal()
}}>Chat Data Prep</Button>
<div className="clean-section" onClick={()=>{
handleCleanData()
}} >
<AiOutlineClear size={25}/>
<span>Clean</span>
</div>

<button className='btn btn-success' onClick={downloadCSV}>Download CSV</button>
</div>

{ loading? <Spin className='spinner' size={'large'}/>:
    <table>
          <thead>

          <tr>
          {
        headers.map((header,index)=>{
return <th key={index}>{header}</th>
                })
              }
          </tr>

        </thead>
 
      <tbody>


<tr>
{
headers.map((header,index)=>{
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if(!isNaN(data[0][header])){
    return <td key={index}><span className="badge rounded-pill bg-dark">Number</span> </td>
  }
  else if (!isNaN(Date.parse(data[0][header]))){
    return <td key={index}><span className="badge rounded-pill bg-secondary">Date</span></td>
  }
  else if(timePattern.test(data[0][header])){
    return <td key={index}><span className="badge rounded-pill bg-danger">Time</span></td>
  }
  else if(isNaN(data[0][header])){
    return <td key={index}><span className="badge rounded-pill bg-primary">String</span></td>
  }

})
}

</tr>

<tr>
  {
  headers.map((header,id)=>{
const updatedArray=data.map((value)=>{
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if(!isNaN(value[header])){
    return parseInt(value[header])
  }
  else if (!isNaN(Date.parse(value[header]))){
    const date = new Date(value[header])
    return date.getDate()
  }
  else if (timePattern.test(value[header])){
    return parseInt(value[header].slice(0,3))
  }
  else {
    return value[header]
  }
})

let uniqueArr = removeDuplicates(updatedArray)

if(uniqueArr.length>6){

const updatedData = uniqueArr.map((uniVal)=>{

return {
  value:uniVal,
count:count(updatedArray,uniVal)
}
})

return (<td className='firstRow' style={{overflowX:"scroll",cursor:"pointer"}} key={id} 
onClick={()=>{
displayPopupFun({
  rows:data.length,
  uniqueValues:uniqueArr.length,
  uniqueArr:uniqueArr,
  updatedData:updatedData,
  title:header
})
setPopup(displaypopup)
setDisplaypopup(true)
}}
><p>{uniqueArr.length} Unique Values</p>
<BarGraph data={updatedData} width={200} className="graph" cursor={'pointer'} header={header} />
</td>)
}

else if (uniqueArr.length <=6 ){
  const filteredArr = uniqueArr.filter((uniqueVal)=>{

return uniqueVal !== undefined && uniqueVal !== "" 
  })
  console.log(filteredArr)
 const arr = filteredArr.map((uniqueVal,index)=>{
    let value = count(updatedArray,uniqueVal)
    let percent = Math.round((value/(updatedArray.length))*100).toFixed(2)
  return percent   
    })
if(arr.includes("0.00")){
  const index= arr.indexOf("0.00")
  arr.splice(index,1)
}
 return <td className='firstRow' style={{overflowX:"scroll",cursor:"pointer"}} key={id}
 onClick={()=>{
  displayPopupFun({
    rows:data.length,
    uniqueValues:uniqueArr.length,
    uniqueArr:uniqueArr,
    updatedData:arr,
    title:header
  })
  setPopup(displaypopup)
  setDisplaypopup(true)
  }}
 >

<div className="first-container">
<span>{arr.length} Unique Values</span>
     {
      arr.map((percentValue,index)=>{

        if(percentValue !== "0.00"){
          return <>
          <div className="progress-container">
          <p>{uniqueArr[index]}</p>
          <Progress style={{width:"220px"}} strokeColor={'rgb(252, 128, 3)'} size="small" key={index} percent={percentValue} status="active" />
          </div>
    
             </>
        }
        
      })
     }
     </div>
</td>
}

})

}
</tr>
        {data.map((row, index) => {
     return <tr
            key={index}
            className={index === hoveredRowIndex ? 'hovered' : ''}
            onMouseEnter={() => handleRowHover(index)}
            onMouseLeave={() => handleRowHover(-1)}
          >
            {
              headers.map((head,index)=>{
               return <td key={index} >{row[head]}</td>
              })  
            }
           
            {/* Add more data columns as needed */}
          </tr>
})}
      </tbody>
    </table>
}
  </div>
{
  displaypopup ? <EndPopup setDisplaypopup={setDisplaypopup} popup={popup} /> : <></>
}

<Modal
      title="Chat Data Prep"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Submit"
        okButtonProps={{disabled:prepData?false:true}}
      >
         <Input size='large' onChange={(e)=>handleEvent(e)} value={prepData}  type="text" placeholder="e.g. Filter out all columns except the first 2" />

      </Modal>
  </>
  )
}

export default DisplayData