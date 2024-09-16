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
            <p className="py-6 text-xl font-bold">
              This is a online coding platform that will allow users to write
              code while collaborating with others and solve complex programming
              challenges together.
            </p>
            <p className="mt-3 mb-3 text-lg">
              <span className="font-extrabold">NOTE :</span> It's better when
              used with discord or any other live interactive platform for
              smoother experience. Can be used for interviews and friendly
              coding sessions
            </p>
            <button className="btn border-white bg-slate-700">
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
