"use client";
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Image from "./Image";
import Video from "./Video";
import Ads from "@/app/Ads";
import { FaImages } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";




const page = ({ params }) => {
  const socket = useRef();
  const [msg, setmsg] = useState("");
  const [chat, setchat] = useState([]);
  const chatContainerRef = useRef(null);
  const [left, setLeft] = useState(false);
  const [room, setRoom] = useState(null);
  const [write, setwrite] = useState(true);
  const [go, setgo] = useState(true);
  const [id, setId] = useState();
  const [join, setjoin] = useState(false);
  const [file, setFile] = useState("");
  const [type, settyping] = useState(false);
  const [users, setUsers] = useState([]);
  const [load, setload] = useState(false);
  const [landscape, setlandscape] = useState(false);
  const joinTimeoutRef = useRef(null);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [interes, setinteres] = useState("");
  const [stream, setStream] = useState();
  const [sending, setsending] = useState(false)
  const isInitialRender = useRef(true);


  const handleSubmit = (event) => {
    event.preventDefault();
    setwrite(true);
    if ((msg.trim() == "" && file == "" ) || (!file && msg.trim() == "") ||  join == false || left == true) {
      return;
    }
    if (file) {
      if (file.size > 500 * 1024) {
        alert("Please select an image smaller than 500KB.");
        return;
      }

      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (allowedExtensions.includes(fileExtension)) {

      setsending(true)
      const filedata = {
        id: id,
        type: "file",
        body: file,
        mimeType: file.type,
        fileName: file.name,
        msg: msg,
      };
      socket.current.emit("send_message", { filedata, room });
      setmsg("");
      setFile("");
      } 
      else{
        setmsg("");
        setFile("");
        alert("File is not a valid image type ");
        return;
      }
    } else {
      socket.current.emit("send_message", { msg, room, id: id });
      setmsg("");
    }
  };


  const GetRoom = async (idsocket) => {
    setLeft(false);
    setsending(false)
    setjoin(false);
    setchat([]), setmsg("");
    setRoom(null);
    const text = params.text;
    const interest = params.interest;
    setId(idsocket);
    try {
      const Data = await fetch(
        `https://junkybackend.fly.dev/getRoom/${idsocket}?category=${text}&interest=${interest}`
      );
      const info = await Data.json();
      if (info.data) {
        const room = info.data._id;
        setRoom(room);
        socket.current.emit("join_room", room);
        setload(true);
      } else {
        console.log("No room data found");
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.current.disconnect();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return async () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (joinTimeoutRef.current) {
        clearTimeout(joinTimeoutRef.current);
      }
      skip();
      await socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {};
    window.addEventListener("beforeunload", handleBeforeUnload);
    return async () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  const skip = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setCallerSignal();
    setCaller("");
    setsending(false)
    setchat([])
  };

  useEffect(() => {
    return () => {
      if (joinTimeoutRef.current) {
        clearTimeout(joinTimeoutRef.current);
      }
    };
  }, [join]);

  const Skip = async () => {
    settyping(false);
    setsending(false)
    setLeft(false)
    setjoin(false);
    setchat([])
    socket.current.disconnect();
    skip();
    await socket.current.connect();
    socket.current.emit("connectid");
  };

  useEffect(() => {
    
    socket.current = io.connect("https://junkybackend.fly.dev");
    socket.current.emit("connectid");
  }, []);

  useEffect(() => {
    socket.current.on("idsocket", (idsocket) => {
      GetRoom(idsocket);
    });
    socket.current.on("receive_message", (message) => {
      settyping(false);
      setsending(false)
      setwrite(true)
      setchat((prevChat) => [...prevChat, message]);
    });
    socket.current.on("left_partner", (message) => {
      settyping(false);
      setsending(false)
      setLeft(message.left);
    });

    socket.current.on("typing", (message) => {
      settyping(message);
    });

    socket.current.on("room_joined", (join) => {
      setjoin(join.join);
      setUsers(join.users);
      setinteres(join.interest);
    });
  }, [socket]);


  const handleKeyPress = (event) => {
    if (event.key == "Escape") {
      Skip();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleimage = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const Typing = () => {
    const type = true;
    socket.current.emit("typing", { type, room });
  };

  useEffect(() => {
    if(msg.trim() == "" && !isInitialRender.current)
    {
    const type = false;
    setwrite(true);
    socket.current.emit("typing", { type, room });
    }
    if (write && !isInitialRender.current) {
      Typing();
      setwrite(false);
    }
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [go]);

  useEffect(()=>{
    if(!file)
    {
      const type = false;
      socket.current.emit("typing", { type, room });
      setFile("")
    }

  },[file])

  return (
    <div className=" h-[100svh]  w-full overflow-hidden  justify-between flex xl:flex-row flex-col xl:justify-between xl:items-end bg-body">
      <Ads />
      {load ? (
        <section
          className={` h-[80%] lg:h-[90%] w-[100vw] xl:w-[79vw] 2xl:w-[83vw] relative flex ${
            landscape ? "md:flex-col" : "md:flex-row flex-col "
          } justify-center`}
        >
          {params.text == "video" && (
            <div
              className={`${
                landscape
                  ? "w-full h-[65%] hidden xl:block"
                  : " w-[100%] md:w-[40%] 2xl:w-[40%]  h-full"
              } overflow-hidden`}
            >
              <Video
                id={id}
                room={room}
                users={users}
                landscape={landscape}
                setlandscape={setlandscape}
                socket={socket}
                left={left}
                caller={caller}
                setCaller={setCaller}
                callerSignal={callerSignal}
                setCallerSignal={setCallerSignal}
                callAccepted={callAccepted}
                setCallAccepted={setCallAccepted}
                callEnded={callEnded}
                setCallEnded={setCallEnded}
                stream={stream}
                setStream={setStream}
              />
            </div>
          )}
          <div
            className={` w-full pb-5 overflow-hidden  relative ${
              landscape
                ? " h-[30%] hidden xl:block"
                : params.text == "video"
                ? " w-[50%] md:w-[60%]  h-full 2xl:w-[59%]"
                : "w-full  h-full"
            } flex flex-col justify-start `}
          >
            <div
              className={`bg-midnight w-full  ${
                landscape ? "h-[70%]" : "h-full"
              } p-2 overflow-hidden `}
            >
              <div className="border-opacity-70 mb-4 pb-2 sm:pb-4 w-full border-b-purple border-b-[1px]">
              {left ? (
                    <p className=" text-sm sm:text-lg font-semibold mb-1 sm:mb-2 text-white">
                      {"Stranger has disconnected click SKIP"} 💔
                    </p>
                  ):

                <>
                {join ? (
                  <div className=" flex flex-col">
                    <p className=" text-white text-sm sm:text-lg font-semibold mb-1 sm:mb-2">
                      You're now chatting with a random stranger. Say Hi! 👍
                    </p>
                    {interes != "" && (
                      <div className=" flex text-white text-sm sm:text-lg font-semibold">
                        <p>{`You are both interested in ${interes}`}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className=" flex items-center">
                    <p className=" mr-3 text-white  text-sm sm:text-lg font-semibold">
                      Currently searching for a stranger
                    </p>
                    <div className=" sm:w-3 bg-purple sm:h-3 w-2 h-2  border-black border-2 rotate-90 animate-bounce"></div>
                    <div className=" sm:w-3 bg-purple sm:h-3 w-2 h-2 border-black   border-2 rotate-90 animate-bounce mx-3"></div>
                    <div className=" sm:w-3 bg-purple sm:h-3 w-2 h-2 border-black  border-2 rotate-90 animate-bounce"></div>
                  </div>
                )}</>}
              </div>
              <div
                ref={chatContainerRef}
                className={`overflow-y-scroll  scrollbar-thin ${landscape?'pb-16':'pb-32 sm:pb-40 md:pb-60'} scrollbar-thumb-[#201D23] scrollbar-track-transparent h-full`}
              >
                {chat.map((e, i) => {
                  if (e.filedata != "") {
                    const blob = new Blob([e.filedata.body], {
                      type: e.filedata.type,
                    });

                    return (
                      <div className=" flex items-start mb-10" key={i}>
                        <div className="min-w-[36px] max-w-[36px]  sm:min-w-[56px] sm:max-w-[56px] min-h-[36px] max-h-[36px] sm:min-h-[56px] sm:max-h-[56px] mr-4 border-white border-[1px] rounded-full overflow-hidden">
                          <img
                            src={e.user == id ? "/18.png" : "/3.png"}
                            className=" w-full h-full "
                          />
                        </div>
                        <div>
                          <b
                            className=" font-bold sm:text-lg mb-3 underline "
                            style={
                              e.user == id
                                ? { color: "#DD00FF" }
                                : { color: "#00FF62" }
                            }
                          >
                            {e.user == id ? "You:" : "Stranger:"}
                          </b>
                          <div className="">
                            <Image blob={blob} />
                          </div>
                          {e.m != "" && (
                            <p className=" text-sm sm:text-base break-all text-white font-semibold ">
                              {e.m}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className=" flex items-start mb-5" key={i}>
                        <div className="min-w-[36px] max-w-[36px]  sm:min-w-[56px] sm:max-w-[56px] min-h-[36px] max-h-[36px] sm:min-h-[56px] sm:max-h-[56px] mr-4 border-white border-[1px] rounded-full overflow-hidden">
                          <img
                            src={e.user == id ? "/18.png" : "/3.png"}
                            className=" w-full h-full"
                          />
                        </div>
                        <div>
                          <b
                            className=" font-bold sm:text-lg underline"
                            style={
                              e.user == id
                                ? { color: "#DD00FF" }
                                : { color: "#00FF62" }
                            }
                          >
                            {e.user == id ? "You:" : "Stranger:"}
                          </b>
                          {e.m != "" && (
                            <p className=" text-sm break-all sm:text-base text-white font-semibold  ">
                              {e.m}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
                <div className=" text-white font-semibold mt-5">
                  {left && (
                    <p className=" text-sm sm:text-lg mb-10">
                      {"Stranger has disconnected"} 💔
                    </p>
                  )}
                  {type && <p className="text-sm sm:text-base">{"Stranger is typing ..."}</p>}
                  {sending &&<div className=" flex items-center">
                    <p className=" mr-1 text-white  text-sm sm:text-base">
                      Sending
                    </p>
                    <div className=" sm:w-2 bg-purple sm:h-2 w-1 h-1 border-1 border-black  rotate-90 animate-bounce"></div>
                    <div className=" sm:w-2 bg-purple sm:h-2 w-1 h-1 border-1 border-black rotate-90 animate-bounce mx-1"></div>
                  </div>}
                </div>
              </div>
            </div>
            <form
              className=" flex items-center bg-midnight  text-white h-12 2xl:h-14 mt-5 w-full bottom-3  absolute "
              onSubmit={handleSubmit}
            >
              <div
                className="px-5 lg:px-10  h-full flex flex-col justify-center items-center bg-purple cursor-pointer"
                onClick={Skip}
              >
                <div className=" font-bold  sm:text-xl">Skip</div>{" "}
                <div className=" font-bold text-xs">Esc</div>
              </div>
              <input
                type="text"
                className=" bg-midnight  border-purple border-[1px] h-full py-3 outline-none  border-opacity-70 w-full sm:text-lg px-3 resize-none"
                placeholder="Type a message"
                value={msg}
                onChange={(e) => {
                  setgo(!go);
                  setmsg(e.target.value);
                }}
              />
              <div className=" mx-3 px-3  border-purple w-fit relative border-[1px]  border-opacity-70 h-full  ">
                <input
                  type="file"
                  accept="image/*"
                  className=" opacity-0  left-0 h-full w-full absolute top-0 z-40 cursor-pointer"
                  onChange={(e) => {
                    setgo(!go);
                    handleimage(e);
                  }}
                />
                <FaImages className=" w-full h-full"/>
                <div className=" absolute bottom-0 right-0">
                  {(file == "" || !file )||<FaCheckCircle className=" text-[#00FF62]"/>
}
                </div>
              </div>
              <div className=" px-5 lg:px-10 h-full flex flex-col justify-center items-center  bg-purple cursor-pointer relative">
                <input
                  type="submit"
                  className="absolute w-full h-full z-40"
                  value=""
                />
                <div className=" font-bold sm:text-xl">Send</div>{" "}
                <div className=" font-bold text-xs">Enter</div>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <div className=" flex justify-center items-center w-[100vw]  h-[80svh] lg:h-[90svh] xl:w-[79vw] 2xl:w-[83vw]">
          <div className=" w-20 border-[2px] border-r-transparent border-purple animate-spin rounded-full h-20"></div>
        </div>
      )}
    </div>
  );
};

export default page;
