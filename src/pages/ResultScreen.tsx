// src/ResultScreen.tsx
import type React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { sendToGAS } from "../hooks/useSendToGAS";

const formatTime = (ms: number) => {
	const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((ms / (1000 * 60)) % 60);
	const seconds = Math.floor((ms / 1000) % 60);
	const milliseconds = Math.floor((ms % 1000) / 10);
	return `${String(hours).padStart(2, "0")}時間${String(minutes).padStart(2, "0")}分${String(seconds).padStart(2, "0")}秒${String(milliseconds).padStart(2, "0")}`;
};

const formatTimeHour = (timeStr: string) => {
	// 先頭が「00時間」なら削除
	const cleanedTime = timeStr.startsWith("00時間") ? timeStr.slice(4) : timeStr;
	return cleanedTime;
};

interface ResultScreenProps {
	selectedSetTitle: string;
	elapsedTime: number;
	userName: string;
	passCount: number;
	submitResult: boolean;
	setSubmitResult: (value: boolean) => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
	selectedSetTitle,
	elapsedTime,
	userName,
	passCount,
	submitResult,
	setSubmitResult,
}) => {
	const sentRef = useRef(false);

	useEffect(() => {
		const postDataToGAS = async () => {
			const postData = {
				selectedSetTitle,
				userName,
				clearTime: formatTime(elapsedTime),
				passCount,
			};
			await sendToGAS(postData);
		};

		if (!sentRef.current && !submitResult) {
			postDataToGAS();
			sentRef.current = true;
			setSubmitResult(true);
		}
	}, [
		selectedSetTitle,
		userName,
		elapsedTime,
		passCount,
		submitResult,
		setSubmitResult,
	]);

	const handleTweet = () => {
		const tweetText = [
			"#例外謎 に参加したあなたは「Riddle Time Attack」を先行体験した！",
			`セット：${selectedSetTitle}`,
			`タイム：${formatTimeHour(formatTime(elapsedTime))}`,
			`パス回数：${passCount}回`,
			"でした！！",
			"",
			"みんなで結果を共有して競い合おう！",
			"#RiddleTA",
		].join("\n");

		window.open(
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
			"_blank",
		);
	};

	return (
		<Box textAlign="center" mt={0}>
			<Box textAlign="center" mt={1}>
				<Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
					{`結果 (${selectedSetTitle})`}
				</Typography>
				<Box mt={2} textAlign="left" sx={{ mx: "auto", maxWidth: 300 }}>
					<Typography variant="body1" sx={{ fontSize: "1.0rem" }}>
						{`・タイム：${formatTimeHour(formatTime(elapsedTime))}`}
					</Typography>
					<Typography variant="body1" sx={{ fontSize: "1.0rem" }}>
						{`・パス回数：${passCount}回`}
					</Typography>
				</Box>
			</Box>

			<Button
				variant="contained"
				color="primary"
				onClick={handleTweet}
				sx={{ mt: 2 }}
			>
				Xで投稿(結果のみSNS投稿OKです)
			</Button>
		</Box>
	);
};

export default ResultScreen;
