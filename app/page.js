import Hero from "@/components/Hero";
import LandingNavbar from "@/components/LandingNavbar";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col ">
        <LandingNavbar />
      </div>
      <div className=" flex-1 mt-5">
        <Hero />
      </div>
    </main>
  );
}
