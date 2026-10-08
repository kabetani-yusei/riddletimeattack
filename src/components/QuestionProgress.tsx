import type React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import type { QuestionResult } from "../utils/types";

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.7); }
  50% { box-shadow: 0 0 0 4px rgba(245,158,11,0); }
`;

interface Props {
	total: number;
	current: number;
	results: QuestionResult[];
}

// 全10問のうち何問目かを一目で分かるように表示する
const QuestionProgress: React.FC<Props> = ({ total, current, results }) => (
	<Box sx={{ display: "flex", gap: 0.5, width: "100%" }}>
		{Array.from({ length: total }, (_, i) => {
			const result = results[i];
			const isCurrent = i === current && !result;
			let bg = "rgba(255,255,255,0.22)";
			if (result === "correct") bg = "#10b981";
			if (result === "pass") bg = "#ef4444";
			if (isCurrent) bg = "#f59e0b";
			return (
				<Box
					// biome-ignore lint/suspicious/noArrayIndexKey: 固定長の表示用
					key={i}
					sx={{
						flex: 1,
						height: 8,
						borderRadius: 4,
						bgcolor: bg,
						transition: "background-color 0.3s",
						animation: isCurrent ? `${pulse} 1.6s infinite` : undefined,
					}}
				/>
			);
		})}
	</Box>
);

export default QuestionProgress;
