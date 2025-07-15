"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {

  let [searchResults, setSearchResults] = useState([]);
  let [isFocused, setIsFocused] = useState(false);
  let [isHovered, setIsHovered] = useState(false);

  async function search(query: { search: string }) {
    const response = await fetch('http://localhost:3000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  function navigate(url: string) {
    window.location.href = url;
  }

  return (
    <div className="flex flex-col bg-neutral-800 items-center justify-between w-screen h-screen"> 
      {/* Top infomatics bar, holds settings, account, and an about */}
        <div className="flex flex-row justify-between w-screen h-[5%] p-2 text-rose-600">
          <div className="flex flex-row">
            <a href="/about" className="hover:text-rose-400">About</a>
          </div>
          <div className="flex flex-row w-[10%] justify-between items-center">
            <a href="https://mail.google.com/" className="hover:text-rose-400">Gmail</a>
            <a href="https://calendar.google.com/" className="hover:text-rose-400">Calendar</a>
            <img src="/account_icon.svg" alt="Search Icon" width={40} height={40} className="p-1 rounded-full bg-neutral-900 hover:cursor-pointer hover:bg-neutral-700" onClick={() => navigate('/account')}/>
          </div>

        </div>
      {/* Middle main body, has the title, the searchj bar, etc */}
      <div className="flex flex-col w-screen h-[90%] items-center justify-center space-y-6">
        <h1 className="text-center text-7xl text-rose-600 font-bold">Querry-Berry</h1>
        <div className={`flex flex-row items-center justify-left space-x-2 w-[30%] rounded-3xl p-2 ${isFocused ? 'border-2 border-rose-500' : ''} ${isHovered ? 'shadow-lg bg-neutral-600' : 'bg-neutral-700'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <Image src="/search_icon.svg" alt="Search Icon" width={24} height={24} />
          <input 
            type="text" 
            placeholder="Search..." 
            className={` text-rose-200 p-2 rounded-md w-full focus:outline-none ${isHovered ? 'bg-neutral-600' : 'bg-neutral-700'}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                const query = { 'search' : e.currentTarget.value };
                try {
                  const results = await search(query);
                  console.log(results); // Handle results as needed
                  setSearchResults(results);
                } catch (error) {
                  console.error('Error fetching search results:', error);
                }
              }
            }}
          />
        </div>
      </div>
      {/* Bottom bar, Has privacy, terms, settings */}
        <div className="flex flex-row justify-between items-center bg-neutral-900 w-screen h-[5%] mt-[10%] p-2 text-rose-600">
          <a href="/privacy" className="hover:text-rose-400">Privacy</a>
          <a href="/terms" className="hover:text-rose-400">Terms</a>
        </div>
      <div> 
      </div>
    </div>
  );
}
