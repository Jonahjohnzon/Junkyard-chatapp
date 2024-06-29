"use client"
import React,{ useEffect, useState }  from 'react'
import { LazyLoadImage } from "react-lazy-load-image-component";


const Image = ({blob}) => {
    const [src, setSrc] = useState("")
    const [show, setshow] = useState(false)
useEffect(()=>{
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);
    setSrc(imageUrl);
    
},[blob])

  return (
    <div ><LazyLoadImage className=" cursor-pointer w-40 h-40  border-white border-opacity-80 border-[2px]  text-white" src={src} alt={"image"} onClick={()=>{setshow(true)}}/>
    {show && <div className=" cursor-pointer fixed w-[100vw]  flex justify-center items-center top-0 left-0 h-[100vh] z-50 bg-blend-darken " onClick={()=>{setshow(false)}}>
      <LazyLoadImage className="w-[50vw] sm:w-[400px]  h-[70vh] border-white border-opacity-50 border-[1px] text-white" src={src} alt={"image"}/>
        </div>}
    </div>
  )
}

export default Image