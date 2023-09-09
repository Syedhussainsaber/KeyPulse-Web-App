import React, { useEffect, useState } from 'react'
import { useDataAPI } from '../contexts/GetDataApi'
import BarGraph from './BarGraph'
import {AiOutlineClose} from "react-icons/ai"
import { Progress } from 'antd'

const EndPopup = ({setDisplaypopup,popup}) => {
  const { 
    displayPopup
  } = useDataAPI()


useEffect(()=>{

},[displayPopup,popup])

  return (
<>


<div className={popup ? 'popup-container open-popup': 'popup-container close-popup'} >
  <div className="title">
{displayPopup.title}
<AiOutlineClose cursor={"pointer"} className='close-btn' size={25} onClick={()=>{

 setDisplaypopup(false) 
}} />
  </div>
  <div className="data">
<div className="rows">
{displayPopup.rows} Rows
</div>
<div className="unique-values">
{
  displayPopup.uniqueValues
} Unique Values
</div>
  </div>
  <div>
    {

displayPopup.updatedData.length <=6 ? <div className='graph'>
  <div className="progress-container">
{
  displayPopup.updatedData.map((value,index)=>{
    if(index < 3){
      return <>
      <p>{displayPopup.uniqueArr[index]}</p>
      <Progress percent={value} size={"large"}  style={{width:"200px"}} strokeColor={'rgb(252, 128, 3)'}  key={index}/>
      </>
    }
  })
}
</div>
</div> :

  <BarGraph data={displayPopup.updatedData} cursor={'pointer'} header={displayPopup.title} />

}

  </div>
</div>

</>
  )
}

export default EndPopup