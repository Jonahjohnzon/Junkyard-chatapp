"use client";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { GiSpeakerOff } from "react-icons/gi";
import { CgScreen } from "react-icons/cg";




const Video = ({ id, room, users, socket,left, setlandscape, landscape, caller, setCaller,callerSignal, setCallerSignal,callAccepted, setCallAccepted,callEnded, setCallEnded, stream, setStream}) => {
  const [mute, setmute] = useState(false)
 const [load, setload] = useState(false)
  const [ans, setans] = useState(false)
  const userVideo = useRef();
  const connectionRef = useRef();
  const myVideo = useRef();

  

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      setload(true)
    }).catch((error) => {
      console.error('Error accessing camera and microphone:', error);
    });

    socket.current.on("callUser", (data) => {
      setCaller(data.from);
      setCallerSignal(data.signal)
    });

  }, [myVideo]);

useEffect(()=>{
if(callerSignal &&  !callAccepted  && ans)
{
  answerCall()
}
  },[callerSignal, ans])

useEffect(()=>{
if(left)
{
  leaveCall()
}
},[left])



useEffect(()=>{

    if(users.length == 2 && load)
    {
      const fId = users[0]
      if(fId == id)
      {
        
        callUser()
      }
    }
  },[users,ans])

useEffect(()=>{
  if(myVideo.current)
  {
  myVideo.current.srcObject = stream;
  myVideo.current.style.transform = "scaleX(-1)";
  setans(true)
  }
},[load])

  const callUser = () => {
    if(connectionRef.current)
    {
    connectionRef.current.destroy()
    }

    setCallEnded(false);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: {  iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:standard.relay.metered.ca:80",
          username: "0163889f88854c947cc8a92d",
          credential: "HbxlVqbUb3eQvFbK",
        },
        {
          urls: "turn:standard.relay.metered.ca:80?transport=tcp",
          username: "0163889f88854c947cc8a92d",
          credential: "HbxlVqbUb3eQvFbK",
        },
        {
          urls: "turn:standard.relay.metered.ca:443",
          username: "0163889f88854c947cc8a92d",
          credential: "HbxlVqbUb3eQvFbK",
        },
        {
          urls: "turns:standard.relay.metered.ca:443?transport=tcp",
          username: "0163889f88854c947cc8a92d",
          credential: "HbxlVqbUb3eQvFbK",
        },
    ],},
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: room,
        signalData: data,
      });
    });

    peer.on("stream", (stream) => {
      if(userVideo.current)
      {
      userVideo.current.srcObject = stream;
      userVideo.current.play()
      }
    });
      let a = false
    socket.current.on("callAccepted", (signal) => {

      if(!a)
      {
      setCallAccepted(true);
      peer.signal(signal);
      a = true
      }
    }); 
    connectionRef.current = peer;
  };

  let b = false
  const answerCall = () => {
    if(connectionRef.current)
    {
    connectionRef.current.destroy()
    }
    setCallAccepted(true)
    setCallEnded(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: {  iceServers: [
        {
          urls: "stun:freeturn.net:3478",
        },
        {
          urls: "turn:freeturn.net:3478",
          username: "free",
          credential: "free",
        }
    ], },
    });
    peer.on("signal", (data) => {
          socket.current.emit("answerCall", { signal: data, to: caller });

  });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
      userVideo.current.play()
    });

    if(!b){
    peer.signal(callerSignal);
    b = true
    }
    connectionRef.current = peer;
  };


  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false)
    setCallerSignal()
    setCaller("")
    connectionRef?.current?.destroy()
  };



  return (
    <>
        {load?<div className="flex flex-row h-full w-full justify-center">
           
              <div className={`flex w-full relative h-fit md:h-full   ${landscape?'flex-row justify-around':'flex-col justify-around'} items-center  h-full`}>
              <div className={`flex flex-col bg-midnight rounded-lg absolute h-[260px] md:h-[220px] lg:h-[270px] 2xl:h-[340px] 3xl:h-[380px] z-30 top-0 md:static  ${landscape?'w-[45%]':' md:w-[300px] lg:w-[350px] 2xl:w-[530px] w-full'} items-center justify-center overflow-hidden `}>
               
                  {callAccepted && !callEnded ? (
                    <div className="relative w-full h-full group">
                       <div className=" absolute top-5 left-3 cursor-pointer  opacity-100 transition-all ease-in-out duration-500  z-40 bg-[#5A5A5A]  rounded-full" onClick={()=>setmute(!mute)}>
                        {mute?<GiSpeakerOff className="text-white text-2xl"/>:<HiMiniSpeakerWave  className="text-white text-2xl"/>}
                       </div>
                    <video
                      className=" w-full h-[260px] md:h-[220px]  lg:h-[270px] 2xl:h-[340px] 3xl:h-[380px]"
                      playsInline
                      ref={userVideo}
                      autoPlay
                      style={{ transform: "scaleX(-1)" }}    
                      muted={mute}       
                    />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col w-full justify-center items-center">
                    <div className=" w-full h-full flex justify-center items-center bg-[#5A5A5A] ">
                      <div className=" border-gray border-r-4 w-14 animate-spin rounded-full h-14"></div>
                    </div>
                    </div>
                  )}
                </div>
                <div className={` ${landscape?'w-[45%]':'md:w-[300px] lg:w-[350px] 2xl:w-[530px]  w-[100px]'} rounded-lg h-[130px] md:h-[220px]  lg:h-[270px] 2xl:h-[340px] 3xl:h-[380px]  bg-midnight border-white  border-2 md:border-0   right-0 z-50 absolute  top-0 md:relative flex flex-col items-center justify-center overflow-hidden `}>
                  <div className="video w-full group h-[260px] md:h-[220px] lg:h-[270px] 2xl:h-[380px]">
                  <div className="hidden xl:block absolute bottom-5 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500 right-3 cursor-pointer z-40 bg-[#5A5A5A] px-1" onClick={()=>setlandscape(!landscape)}>
                        <CgScreen className="text-white text-2xl"/>
                       </div>
                      <video
                        className="  w-full h-[130px] md:h-[220px] lg:h-[270px] 2xl:h-[340px] 3xl:h-[380px]"
                        playsInline
                        muted
                        ref={myVideo}
                        autoPlay
                        
                       
                      />
                
                  </div>
                </div>

              </div>

          </div>:<div></div>}
    </>
  );
};

export default Video;
