import type React from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

import {
	EFFECT_DURATIONS,
	type Effect,
	type EffectKind,
} from "../utils/effects";

const burst = keyframes`
  0% { transform: scale(0.4) rotate(-6deg); opacity: 0; }
  18% { transform: scale(1.12) rotate(2deg); opacity: 1; }
  30% { transform: scale(1) rotate(0deg); opacity: 1; }
  78% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.15); opacity: 0; }
`;

const flash = keyframes`
  0% { opacity: 0; }
  15% { opacity: 1; }
  75% { opacity: 1; }
  100% { opacity: 0; }
`;

const settings: Record<
	EffectKind,
	{ main: string; sub?: string; color: string; bg: string }
> = {
	start: {
		main: "START!",
		color: "#fff",
		bg: "rgba(91,75,219,0.55)",
	},
	correct: {
		main: "正解！",
		color: "#fff",
		bg: "rgba(16,185,129,0.55)",
	},
	hint: {
		main: "+1分",
		sub: "ヒント ペナルティ",
		color: "#fff",
		bg: "rgba(245,158,11,0.6)",
	},
	pass: {
		main: "+3分！",
		sub: "パス ペナルティ",
		color: "#fff",
		bg: "rgba(239,68,68,0.65)",
	},
	clear: {
		main: "CLEAR!",
		sub: "全問クリア！",
		color: "#fff",
		bg: "rgba(91,75,219,0.75)",
	},
};

interface Props {
	effect: Effect | null;
	onDone: () => void;
}

// パスやヒントの時に画面いっぱいに演出を表示する（操作はブロックしない）
const EffectOverlay: React.FC<Props> = ({ effect, onDone }) => {
	if (!effect) return null;
	const s = {
		...settings[effect.kind],
		duration: EFFECT_DURATIONS[effect.kind],
	};
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
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: `radial-gradient(circle, ${s.bg} 0%, rgba(0,0,0,0.35) 100%)`,
				animation: `${flash} ${s.duration}ms ease-out both`,
			}}
		>
			<Typography
				sx={{
					color: s.color,
					fontWeight: 900,
					fontSize: /^[A-Z!]+$/.test(s.main)
						? "min(17vw, 140px)"
						: "min(24vw, 160px)",
					lineHeight: 1.05,
					textShadow: "0 6px 30px rgba(0,0,0,0.4)",
					animation: `${burst} ${s.duration}ms cubic-bezier(.2,.8,.2,1) both`,
					whiteSpace: "nowrap",
				}}
			>
				{s.main}
			</Typography>
			{s.sub && (
				<Typography
					sx={{
						color: s.color,
						fontWeight: 800,
						fontSize: "min(6vw, 32px)",
						mt: 1,
						textShadow: "0 3px 12px rgba(0,0,0,0.4)",
						animation: `${burst} ${s.duration}ms cubic-bezier(.2,.8,.2,1) both`,
					}}
				>
					{s.sub}
				</Typography>
			)}
		</Box>
	);
};

export default EffectOverlay;
