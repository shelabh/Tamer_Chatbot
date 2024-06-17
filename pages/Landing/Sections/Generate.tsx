"use client";

import { useState } from "react";

const Generate = () => {
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');

  async function generateImage(): Promise<void> {
    setLoading(true);
    try {
      const response = await fetch(`/api/chat/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: searchVal }),
      });

      if (!response.ok) {
        console.error("Failed to generate image");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setImage(data.url);
      setSearchVal("");
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-row justify-between gap-10">
      <div className="w-full">
        <input 
          value={searchVal}
          type="text"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchVal(event.target.value)}
          placeholder="Describe your image"
          className="h-24 min-w-0 p-1 flex-auto w-full appearance-none rounded-md border border-zinc-900/10 bg-white px-3 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm text-gray-900"
        />
       	 	<button 
          	onClick={generateImage}
          	className="bg-black mt-2 rounded-md w-full p-2 text-white"
		>
          		{loading ? 'Loading...' : 'Generate image'}
        	</button>
      	</div>
      	<div className="border bg-white p-5">
      		{image && <img className="image-result" src={image} alt="AI generated"/>}
      	</div>
      
    </div>
  )
}

export default Generate;
