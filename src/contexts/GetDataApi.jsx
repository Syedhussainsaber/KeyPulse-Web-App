import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import Papa, { parse } from 'papaparse';
import { app } from '../../firebaseConfig';
import { DataReducer as reducer } from '../reducers/DataReducer'
// import { getStorage ,ref,uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { Spin } from 'antd';
import { getFirestore,collection,addDoc,onSnapshot, serverTimestamp } from 'firebase/firestore';

const GetDataContext = createContext()

const getLocalFiles = ()=>{
  const localData = localStorage.getItem("files")
if(localData=='[]'){
  return []
}
else if (localData===null){
  return []
}
else if( JSON.parse(localData).length > 0){
  return JSON.parse(localData)
}
else{
  return []
}
}

const initalState = {
  uploadedData : [],
  files:[],
  displayContent: localStorage.getItem("displayContent")? JSON.parse(localStorage.getItem("displayContent")): {
    filename:"",
    headers:[],
    data:[]
  },
  displayPopup : {
    rows:0,
    uniqueValues:0,
    updatedData:[],
    uniqueArr:[],
    title:""
  },
  popup:false
}


const GetDataApi = ({children}) => {

  const [uploadedData, setUploadedData] = useState([])
const [state, dispatch] = useReducer(reducer, initalState)
const [loading, setLoading] = useState(false)
const [selectedFile, setSelectedFile] = useState(null)



useEffect(()=>{
localStorage.setItem("displayContent",JSON.stringify(state.displayContent))
},[state.displayContent])

useEffect(()=>{
getData()
},[])

useEffect(()=>{
localStorage.setItem("files",JSON.stringify(state.files))
},[state.files])

useEffect(()=>{
dispatch({type:"UPLOADED_DATA",payload:uploadedData})
},[state.displayPopup,uploadedData])


// const showData = ()=>{
// dispatch({type:"UPLOADED_DATA",payload:data})
// }



const handleFileChange = (file) => {
  setSelectedFile(file);
};

const removeData = (removeItem)=>{
dispatch({type:"REMOVE_ITEM",payload:removeItem})
}

const loadingFun = ()=>{
return <Spin size='large'/>
}

const db = getFirestore(app);

const handleUpload = async (file) => {
  
setLoading(true)
dispatch({type:"ADD_FILE_DETAILS",payload:file})

  Papa.parse(file, {
    complete: async (result) => {
      const csvData = result.data;
      const flattenedData = csvData.slice(1).map((row) => {
        const rowData = {};
        csvData[0].forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });
console.log(flattenedData)

     

      if(flattenedData !== undefined){
        const encoder = new TextEncoder();
        const value = JSON.stringify(
          {
            filename:file.name, // timestamp:serverTimestamp,
            data:flattenedData,
          }
        )
       let valueArr
        const encodedData = encoder.encode(value);
        if(encodedData.length > 1048487){
 valueArr = value.split("")
valueArr.splice(1048468 , value.length)

valueArr=valueArr.join('')
valueArr=valueArr+'}]}'
try{
  JSON.parse(valueArr)
}
catch(err){
  alert("File Size is exceeded!")
  valueArr=''
}
        }
        else{
          valueArr = value
        }

        await addDoc(collection(db,'uploadedFiles'),{
          field:valueArr
        })
      }
      // Clear the file input and update uploadedData state
      setLoading(false)
getData()
} 
})

};

const getData = ()=>{
 onSnapshot(collection(db,"uploadedFiles"),(res)=>{
setUploadedData(res.docs.map((doc)=>{
  // console.log(doc.data())
   return{
  ...doc.data(),id:doc.id
}
}))
// setCsvData(tempData)
  })

}

const displayPopupFun = (popupData)=>{
  console.log(popupData)
dispatch({type:"DISPLAY_POPUP",payload:popupData})
}

const showContent = (content)=>{
  dispatch({type:"SHOW_CONTENT",payload:content})
}

const changePopup = ()=>{
  dispatch({type:"CHANGE_POPUP"})
}

const handleCleanData = ()=>{
const clean = confirm("Rows containing zero will be removed")
if(clean){
  dispatch({type:'Clean_Data'})
}
}

const handlePrepareData = (inputData)=>{
  dispatch({type:"Prepare_Data",inputData:inputData})
}

  return (
<GetDataContext.Provider value={{...state,handleUpload,loadingFun,removeData,displayPopupFun,showContent,changePopup, handleCleanData, handlePrepareData}}>
{children}
</GetDataContext.Provider>
)
}

const useDataAPI = ()=>{
  return useContext(GetDataContext)
}

export {GetDataApi,useDataAPI}