"use client"

import { useState } from "react";
import Chatbot from "./Sections/Chatbot";
import Generate from "./Sections/Generate";



const Landing = () => {
	const [selected, setSelected] = useState(true);
	const handleSelect = (e: boolean | ((prevState: boolean) => boolean)) => {
		setSelected(e)
	};
	return (
		<>
			<div className="bg-[#47EDA8] h-screen ">
			<div className="max-w-7xl mx-auto py-20 px-8   h-full">
				<div className="  flex w-1/4">
					<button onClick={() => handleSelect(true)} className={selected ? "relative w-full bg-zinc-300 border-zinc-200 m-1 p-2 text-sm font-medium whitespace-nowrap rounded-md border" : "relative w-full m-1 p-2 text-sm font-medium whitespace-nowrap text-gray-600 "}>
						Chatbot
					</button>
					<button onClick={() => handleSelect(false)} className={selected ? "relative w-full m-1 p-2 text-sm font-medium  whitespace-nowrap text-gray-600" : "relative w-full bg-zinc-300 border-zinc-200 m-1 p-2 text-sm font-medium whitespace-nowrap rounded-md border "}>
						Image Generation
					</button>
				</div>
				{selected ? 
					<div className="mt-10">
						<Chatbot />
					</div>
					:
					<>
						<Generate />
					</>
				}
			</div>
			</div>
		</>
	)
}

export default Landing;