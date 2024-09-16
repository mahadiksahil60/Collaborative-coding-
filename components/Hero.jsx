"use Client";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row mr-4">
          <img
            src="https://raw.githubusercontent.com/AlaeddineMessadi/AlaeddineMessadi/main/web-developer-chilling.gif"
            className="max-w-sm rounded-lg shadow-2xl m-5"
          />
          <div>
            <h1 className="text-5xl font-bold font-serif">
              Code together with your friends.
            </h1>
            <p className="py-6 text-xl ">
              This is a online coding platform that will allow users to write
              code while collaborating with others and solve complex programming
              challenges together.
            </p>
            <button className="btn border-white bg-slate-500">
              <Link href="https://github.com/mahadiksahil60">
                Learn More about this Developer
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
