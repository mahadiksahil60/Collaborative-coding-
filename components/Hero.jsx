"use Client"
import Link from 'next/Link'
import React from "react"

export default function Hero(){
    return (
        <>
       <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row mr-4">
    <img
      src="https://camo.githubusercontent.com/19db51af5f90f1b152bc0b9078f5fe97053955be5074f03f17019c70345bdcdb/68747470733a2f2f6d69726f2e6d656469756d2e636f6d2f6d61782f313336302f302a37513379765349765f7430696f4a2d5a2e676966"
      className="max-w-sm rounded-lg shadow-2xl m-5" />
    <div>
      <h1 className="text-5xl font-bold">Solve algorithms together</h1>
      <p className="py-6 font-mono">
        This is a online coding platform that will allow users to write code while collaborating with others and solve complex algorithms 
        together  
            </p>
      <button className="btn border-white"><Link href="https://github.com/mahadiksahil60">Learn More about this Developer</Link></button>
    </div>
  </div>
 
</div>
        </>
    )
}
