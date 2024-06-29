'use client'
import Footer from "./Footer";
import { useState,useEffect } from 'react';
import Link from 'next/link'


export default function Home() {
  const [interest, setinterest] = useState("Optional")

  const Interest=[
    "Flirt","Love","Nigeria","Girls"
  ]


useEffect(()=>{
  window.scrollTo(0, 0); 
},[])

  return (
    <main className=" bg-body  text-white pt-20 sm:pt-40  flex flex-col justify-center items-end">
      <div className=" w-full flex flex-col justify-center items-center">
     <div className=" bg-midnight w-[92%]  md:w-3/4 xl:w-2/4  rounded-lg mb-10 shadow-sm shadow-black">
      <section className=" p-10 flex flex-col items-center ">
        <h1 className=" text-xl sm:text-4xl font-bold mb-3  ">🌟 Welcome to JunkYard! 🌟</h1>
        <p className=" sm:text-xl mb-3 text-center">Forge friendships with random strangers and make friends</p>
        <p  className=" sm:text-xl border-b-[1px] text-center border-gray mb-10 border-opacity-25">Have fun, Note users must be <span className=" text-[#FE0000] font-bold">18+</span></p>
        <div className=" h-[1px] w-full bg-gray opacity-25 mb-8"></div>
        <section className=" w-full">
        <p className=" font-bold text-lg sm:text-2xl mb-5">Interest Examples 🔥</p>
        <div className=" flex w-full mb-10 ">
          {
            Interest.map((e,i)=>{
              return(
                <div key={i} className=" font-bold mr-3 bg-purple w-14 sm:w-20 text-center py-1 sm:text-lg rounded-sm">{e}</div>
              )
            })
          }
        </div>
        <div className=" h-[1px] w-full bg-gray opacity-25 mb-8"></div>
        <div>
          <p className="font-bold text-lg sm:text-2xl mb-5">Add Interest</p>
          <div>
            <input type="text" className=" bg-transparent h-12 w-full  border-[2px] border-gray mb-10  border-opacity-25 px-2 placeholder:text-gray" placeholder="(Optional)"  value={interest} onChange={(e)=>setinterest(e.target.value)}/>
            <div className=" flex">
            <Link  className=" mr-10 cursor-pointer w-24 rounded-sm py-2 font-bold sm:text-lg text-black bg-[#00FF62] text-center " href={`/chat/text/${interest}`}>Text</Link>
            <Link className=" w-24 cursor-pointer rounded-sm py-2 font-bold sm:text-lg text-black bg-[#00FF62]  text-center" href={`/chat/video/${interest}`}>Video</Link>
            </div>
          </div>
        </div>
        </section>
      </section>
      <div>
      </div>
     </div>
     <div className="w-[92%] md:w-3/4 xl:w-2/4  rounded-sm ">
     <p className="font-bold text-lg sm:text-xl mb-2 text-[#FE0000]">Age Restriction Notice:</p>
     <p className=" sm:text-lg mb-5 ">
     <span className=" font-bold">Important:</span> JunkYard is strictly for adults (18 years and older). We are committed to providing a mature and responsible platform for our users. If you are under 18, please do not use our service. This age restriction is in place to ensure the safety and well-being of our community. Thank you for your understanding and cooperation.
     </p>
     <p className="font-bold text-lg sm:text-xl mb-2 text-white">Support JunkYard:</p>
     <div className="sm:text-lg mb-3 ">
     Your contributions help us keep the platform running and improve the chat experience
     </div>
     <div className=" w-[90%]">
      <p className="  mb-1">Bitcoin (BTC): <span className="text-sm sm:text-base text-wrap font-semibold select-text cursor-text">18K7eDcNLorBU5nkbWQStnquLzKAkywCL7</span> </p>
      <p className=" ">Solana (SOL): <span className=" text-sm sm:text-base  text-wrap font-semibold select-text cursor-text ">81y3CNHSQiLJEth6t5s6DZNGZsg6c6zsGd4b6pGDNhPF</span> </p>
     </div>
     </div>
     </div>
     <Footer/>
    </main>
  );
}