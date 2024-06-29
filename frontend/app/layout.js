import { Dosis } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import NextTopLoader from 'nextjs-toploader';



const inter =  Dosis({ subsets: ['latin'] })

export const metadata = {
  title: "Junkyard",
  metadataBase: new URL('https://junkyard.com.ng/'),
  openGraph: {
    title: 'Junkyard | Forge Friendships',
    description: "Chat with random strangers, forge friendships with strangers",
    images:[{url:'https://junkyard.com.ng/opengraph-image.png', width:1200, height:630}]
    ,
  twitter:{
    card:"summary_large_image"
  }
   
  },
  description: "Chat with random strangers, forge friendships with strangers",
  keywords:["chat", 'chat with strangers', 'junkyard', 'omegle', 'omegle alternative', 'chat app', 'video chat', 'video chat with strangers', 'live chat', 'facetime', 'african chat', 'african omegle', 'africa omegle', 'africa chat'],
  creator: 'Mid9it',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-y-scroll scrollbar-thin bg-body h-fit scrollbar-thumb-[#201D23] scrollbar-track-transparent cursor-default select-none ">
      <body className={inter.className} suppressHydrationWarning={true}>
      <link rel="icon" href="/logo.png" sizes="any" />
      <NextTopLoader 
       color="#00FF62"
       initialPosition={0.08}
       crawlSpeed={200}
       height={3}
       crawl={true}
       showSpinner={false}
       easing="ease"
       speed={200}
       shadow="0 0 10px #00FF62,0 0 5px #00FF62"
       className=" z-50"
      />
        <Navbar/>
        {children}
        </body>
    </html>
  );
}