import Image from "next/image";
import React, { useState, useEffect } from "react";

interface VideoSectionProps {
	videoUrl: string | null | undefined; // Allow null or undefined
	aspectRatio?: "16:9" | "4:3" | "1:1"; // Optional aspect ratio
	className?: string; // Allow additional classes
}

export default function VideoSection({
	videoUrl,
	aspectRatio = "16:9",
	className = "",
}: Readonly<VideoSectionProps>) {
	const [isClient, setIsClient] = useState(false);

	// Handle window resize for responsive adjustments
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Calculate padding based on aspect ratio
	const getPaddingBottom = () => {
		switch (aspectRatio) {
			case "4:3":
				return "75%"; // 4:3 aspect ratio
			case "1:1":
				return "100%"; // Square aspect ratio
			case "16:9":
			default:
				return "56.25%"; // 16:9 aspect ratio (default)
		}
	};

	return (
		<div
			className={` relative rounded-md overflow-hidden ${className}`}
			style={{
				paddingBottom: videoUrl ? getPaddingBottom() : "0",
			}}
		>
			{videoUrl ? (
				<iframe
					src={`https://www.youtube.com/embed/${videoUrl}?enablejsapi=1&wmode=opaque&rel=0`}
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
					className="absolute top-0 left-0 w-full h-full border-0"
					loading="lazy"
				></iframe>
			) : (
				<div className="flex justify-center items-center bg-gray-100 rounded-lg w-full">
					<div className="py-8 px-4 w-full">
						<div
							className="relative w-full mx-auto"
							style={{ maxWidth: "400px" }}
						>
							{/* Responsive placeholder with proper aspect ratio */}
							<div style={{ paddingBottom: "75%" }} className="relative">
								{isClient && (
									<Image
										src="/images/no-video.png"
										alt="No video available"
										fill
										sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, 400px"
										priority={false}
										className="object-contain absolute inset-0"
									/>
								)}
							</div>
							<p className="text-center text-gray-500 mt-4 text-sm sm:text-base">
								No video content available
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
