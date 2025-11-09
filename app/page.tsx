import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="h-[100px] flex justify-center">
        <nav className="flex gap-4 w3-animate-opacity items-center backdrop-blur-3xl bg-[#0a0a0a]/70 justify-center h-full">
          <button className="text-1xl poppins-regular hover:border-b-2 border-blue-700 h-full w-[100px]">Home</button>
          <button className="text-1xl poppins-regular hover:border-b-2 border-blue-700 h-full w-[100px]">Events</button>
          <button className="text-1xl poppins-regular hover:border-b-2 border-blue-700 h-full">Announcements</button>
        </nav>
      </div>

      <main>
        <div className="bg-none mt-[70px]">
          <h1 id="title" className="w3-animate-bottom text-center poppins-semibold drop-shadow-[0px_0px_10px_rgba(115,0,255,0.9)]">Notica</h1>
          <p id="sub-title" className="text-center m-[5px] w3-animate-bottom">Make Scheduling, Hosting, and Announcing events easier</p>
        </div>
      </main>
    </div>
  );
}
