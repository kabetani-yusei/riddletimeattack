// src/components/Countdown.tsx
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Typography, Box, LinearProgress } from "@mui/material";
import { keyframes } from "@emotion/react";
import { QUESTION_COUNT } from "../utils/constants";

interface Props {
	onComplete: () => void;
	// 画像の読み込みが終わるまでカウントダウンを始めない
	ready: boolean;
	progress: number;
	setTitle: string;
	initialCount?: number;
}

const pop = keyframes`
  0% { transform: scale(2.2); opacity: 0; }
  30% { transform: scale(1); opacity: 1; }
  80% { transform: scale(0.95); opacity: 1; }
  100% { transform: scale(0.6); opacity: 0; }
`;

const Countdown: React.FC<Props> = ({
	onComplete,
	ready,
	progress,
	setTitle,
	initialCount = 3,
}) => {
	const [count, setCount] = useState(initialCount);
	const completeRef = useRef(onComplete);
	completeRef.current = onComplete;

	useEffect(() => {
		if (!ready) return;
		if (count <= 0) {
			completeRef.current();
			return;
		}
		const timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [count, ready]);

	return (
		<Box
			sx={{
				position: "fixed",
				inset: 0,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				color: "white",
				gap: 2,
				zIndex: 10,
			}}
		>
			<Typography sx={{ opacity: 0.85, fontWeight: 700 }}>
				{setTitle}・全{QUESTION_COUNT}問
			</Typography>
			{ready ? (
				<Typography
					key={count}
					sx={{
						fontSize: "min(40vw, 220px)",
						fontWeight: 900,
						lineHeight: 1,
						animation: `${pop} 1s ease-out both`,
						textShadow: "0 8px 40px rgba(0,0,0,0.35)",
					}}
				>
					{count}
				</Typography>
			) : (
				<Box sx={{ width: 220, textAlign: "center" }}>
					<Typography sx={{ mb: 1, fontWeight: 700 }}>
						問題を準備しています…
					</Typography>
					<LinearProgress
						variant="determinate"
						value={progress * 100}
						color="secondary"
						sx={{ height: 8, borderRadius: 4 }}
					/>
				</Box>
			)}
		</Box>
	);
};

export default Countdown;
