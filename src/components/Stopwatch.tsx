import type React from "react";
import { useEffect, useState } from "react";
import { Typography, type TypographyProps } from "@mui/material";
import { formatClock } from "../utils/time";

interface Props {
	startedAt: number | null;
	penalty: number;
	// 停止後の確定タイム
	finishedTime: number | null;
	sx?: TypographyProps["sx"];
}

// 開始時刻からの経過時間を表示する（リロードしても開始時刻から再計算される）
const Stopwatch: React.FC<Props> = ({
	startedAt,
	penalty,
	finishedTime,
	sx,
}) => {
	const [now, setNow] = useState(() => Date.now());
	const running = startedAt != null && finishedTime == null;

	useEffect(() => {
		if (!running) return;
		let frame = 0;
		const tick = () => {
			setNow(Date.now());
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [running]);

	const elapsed =
		finishedTime ?? (startedAt == null ? penalty : now - startedAt + penalty);

	return (
		<Typography
			component="span"
			sx={{
				fontVariantNumeric: "tabular-nums",
				fontWeight: 800,
				letterSpacing: "0.02em",
				...sx,
			}}
		>
			{formatClock(elapsed)}
		</Typography>
	);
};

export default Stopwatch;
