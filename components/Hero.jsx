"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row px-4 py-8 lg:px-16 lg:py-12">
        <img
          src="https://raw.githubusercontent.com/AlaeddineMessadi/AlaeddineMessadi/main/web-developer-chilling.gif"
          className="max-w-full lg:max-w-sm rounded-lg shadow-2xl mb-5 lg:mb-0 lg:mr-6"
          alt="Web Developer Chilling"
        />
        <div className="text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold font-serif mb-4 lg:mb-6">
            Code together with your friends.
          </h1>
          <p className="py-4 text-lg lg:text-xl font-semibold mb-4">
            This is an online coding platform that allows users to write code
            while collaborating with others and solve complex programming
            challenges together.
          </p>
          <p className="text-base lg:text-lg mb-4">
            <span className="font-extrabold">NOTE:</span> It's better when used
            with Discord or any other live interactive platform for a smoother
            experience. Can be used for interviews and friendly coding sessions.
          </p>
          <button className="btn border-white bg-slate-700 text-white">
            <Link href="https://github.com/mahadiksahil60">
              Made by Sahil Mahadik
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
