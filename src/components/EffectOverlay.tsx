import type React from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { EFFECT_DURATIONS, type Effect } from "../utils/effects";

const fade = keyframes`
  0% { opacity: 0; }
  20% { opacity: 1; }
  100% { opacity: 0; }
`;

const pop = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  20% { transform: scale(1); opacity: 1; }
  80% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.05); opacity: 0; }
`;

// プレイ中は画面の縁だけを光らせ、問題や入力欄は一切隠さない
const edgeColors = {
	correct: "rgba(16,185,129,0.9)",
	hint: "rgba(245,158,11,0.9)",
	pass: "rgba(239,68,68,0.9)",
} as const;

interface Props {
	effect: Effect | null;
	onDone: () => void;
}

const EffectOverlay: React.FC<Props> = ({ effect, onDone }) => {
	if (!effect) return null;
	const duration = EFFECT_DURATIONS[effect.kind];

	if (effect.kind === "clear") {
		// 全問終了後（タイマー停止後）のみ表示する
		return (
			<Box
				key={effect.id}
				onAnimationEnd={(e) => {
					if (e.target === e.currentTarget) onDone();
				}}
				sx={{
					position: "fixed",
					inset: 0,
					zIndex: 1500,
					pointerEvents: "none",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "rgba(30,27,75,0.6)",
					animation: `${pop} ${duration}ms ease-out both`,
				}}
			>
				<Typography
					sx={{
						color: "#fde68a",
						fontWeight: 900,
						fontSize: "min(17vw, 140px)",
						textShadow: "0 6px 30px rgba(0,0,0,0.4)",
					}}
				>
					CLEAR!
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			key={effect.id}
			onAnimationEnd={onDone}
			sx={{
				position: "fixed",
				inset: 0,
				zIndex: 1500,
				pointerEvents: "none",
				boxShadow: `inset 0 0 0 4px ${edgeColors[effect.kind]}, inset 0 0 40px ${edgeColors[effect.kind]}`,
				animation: `${fade} ${duration}ms ease-out both`,
			}}
		/>
	);
};

export default EffectOverlay;
