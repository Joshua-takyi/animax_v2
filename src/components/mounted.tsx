"use client";
import React, { useEffect } from "react";
export default function RenderMounted({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = React.useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) {
		return null;
	}
	return <div>{children}</div>;
}
