// src/ResultScreen.tsx
import type React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
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
	return timeStr.startsWith("00時間") ? timeStr.slice(4) : timeStr;
};

interface ResultScreenProps {
	selectedSetTitle: string;
	elapsedTime: number;
	userName: string;
	hintCount: number;
	passCount: number;
	submitResult: boolean;
	setSubmitResult: (value: boolean) => void;
	refetch: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
	selectedSetTitle,
	elapsedTime,
	userName,
	hintCount,
	passCount,
	submitResult,
	setSubmitResult,
	refetch,
}) => {
	const sentRef = useRef(false);

	useEffect(() => {
		if (!sentRef.current && !submitResult) {
			const postDataToGAS = async () => {
				const postData = {
					selectedSetTitle,
					userName,
					clearTime: formatTime(elapsedTime),
					hintCount,
					passCount,
				};
				await sendToGAS(postData);
				// 結果送信後、最新のランキングを再取得
				refetch();
			};
			postDataToGAS();
			sentRef.current = true;
			setSubmitResult(true);
		}
	}, [
		selectedSetTitle,
		elapsedTime,
		userName,
		hintCount,
		passCount,
		refetch,
		submitResult,
		setSubmitResult,
	]);

	const handleTweet = () => {
		const tweetText = [
			"#「Riddle Time Attack」を遊びました！",
			`セット：${selectedSetTitle}`,
			`タイム：${formatTimeHour(formatTime(elapsedTime))}`,
			`ヒント回数：${hintCount}回`,
			`パス回数：${passCount}回`,
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
						{`・ヒント回数：${hintCount}回`}
					</Typography>
					<Typography variant="body1" sx={{ fontSize: "1.0rem" }}>
						{`・パス回数：${passCount}回`}
					</Typography>
				</Box>
			</Box>

			<Stack spacing={2} mt={2} alignItems="center">
				<Button variant="contained" color="primary" onClick={handleTweet}>
					Xで投稿(結果のみSNS投稿OKです)
				</Button>

				<Button
					variant="outlined"
					color="secondary"
					onClick={() => window.location.reload()}
				>
					タイトルに戻る
				</Button>
			</Stack>
		</Box>
	);
};

export default ResultScreen;
