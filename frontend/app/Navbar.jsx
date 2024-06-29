"use client"
import React from 'react'
import { IoChatbubbles } from "react-icons/io5";
import {FaDiscord} from "react-icons/fa6";
import { FaTelegramPlane, FaRedditAlien } from "react-icons/fa";
import { useRouter } from 'next/navigation';


const Navbar = () => {
  const router = useRouter()
  return (
    <nav className=" bg-midnight h-[7vh] text-white flex select-none justify-between items-center px-5 sm:px-20 shadow-sm shadow-black fixed top-0 z-30 w-full">
        <section>
            <div className=" flex items-center cursor-pointer" onClick={()=>router.push('/')}>
                <p className=" mr-2 text-purple text-2xl sm:text-4xl"><IoChatbubbles/></p>
                <p className=" font-bold text-lg sm:text-xl ">JunkYard</p>
            </div>
        </section>
        <div><p className=" text-white text-4xl font-bold md:block hidden">TALK TO STRANGERS!</p></div>
        <section>
            <div className=" flex items-center">
            <div onClick={()=>router.push('https://discord.gg/EVZKpehR')}><FaDiscord className=" text-xl sm:text-3xl cursor-pointer hover:text-purple "/></div>
            <div><FaTelegramPlane className=" text-xl sm:text-3xl ml-5 cursor-pointer hover:text-purple"/></div>
            <div onClick={()=>router.push('https://www.reddit.com/r/junkyardchat/')}><FaRedditAlien  className=" text-xl sm:text-3xl ml-5 cursor-pointer hover:text-purple"/></div>
            </div>
        </section>
    </nav>
  )
}

export default Navbar