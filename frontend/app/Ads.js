import React from 'react'

const Ads = () => {
  return (
    <div className=" xl:h-[100vh] pt-16 xl:pt-28 px-5 w-[100%] xl:w-[20vw] 2xl:w-[16vw] bg-[#1F1E23] text-white">
      <div className="hidden xl:block mb-5">
        <h1 className=" text-xl xl:text-2xl font-bold underline mb-5">NOTICE</h1>
        <div className=" xl:text-base text-sm flex mb-3"><p className="mr-2">🎲</p><p className=" font-semibold"> Videos are being monitored. keep it clean</p></div>
        <div className=" flex xl:text-base text-sm"><p className="mr-2">🎲</p><p className=" font-semibold"> I am a solo dev, if any bug is found please report on any of the social media accounts</p></div>
      </div>
    <div className=" flex xl:flex-col xl:justify-start justify-between xl:items-center w-full">{
      [1,2,3].map((e)=>{
        return(
          <div key={e} className=" my-2 xl:my-3 w-fit">
            <img src="/ads.png" className=" sm:w-[70%] 2xl:w-full w-32"/>
          </div>
        )
      })
      }</div>
    </div>
  )
}

export default Ads