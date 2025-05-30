import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Typography } from "@mui/material";

interface Props {
	running: boolean;
	additionalTime?: number;
	onTimeUpdate?: (elapsed: number) => void;
	onComplete?: () => void;
}

const Stopwatch: React.FC<Props> = ({
	running,
	additionalTime = 0,
	onTimeUpdate,
	onComplete,
}) => {
	const [elapsed, setElapsed] = useState(0);
	const startTimeRef = useRef<number | null>(null);
	const intervalRef = useRef<number | null>(null);
	// これまでに加算した追加時間を記録する ref
	const lastAdditionalRef = useRef(0);

	useEffect(() => {
		// 追加時間の更新があったとき、前回との差分だけ加算する
		const delta = additionalTime - lastAdditionalRef.current;
		if (delta > 0) {
			setElapsed((prev) => {
				const newElapsed = prev + delta;
				if (startTimeRef.current) {
					startTimeRef.current = Date.now() - newElapsed;
				}
				return newElapsed;
			});
			lastAdditionalRef.current = additionalTime;
		}
	}, [additionalTime]);

	useEffect(() => {
		if (running) {
			startTimeRef.current = Date.now() - elapsed;
			intervalRef.current = window.setInterval(() => {
				const newElapsed = Date.now() - (startTimeRef.current as number);
				setElapsed(newElapsed);
				if (onTimeUpdate) onTimeUpdate(newElapsed);
			}, 10);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [running, elapsed, onTimeUpdate]);

	useEffect(() => {
		if (!running && intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
			if (onComplete) onComplete();
		}
	}, [running, onComplete]);

	const formatTime = (ms: number) => {
		const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((ms / (1000 * 60)) % 60);
		const seconds = Math.floor((ms / 1000) % 60);
		const milliseconds = Math.floor((ms % 1000) / 10);
		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
	};

	return <Typography variant="h5">{formatTime(elapsed)}</Typography>;
};

export default Stopwatch;
