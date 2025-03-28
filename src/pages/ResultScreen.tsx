// src/ResultScreen.tsx
import type React from "react";
import { Box, Button, Typography } from "@mui/material";

interface ResultScreenProps {
	selectedSetTitle: string;
	elapsedTime: number;
	passCount: number;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
	selectedSetTitle,
	elapsedTime,
	passCount,
}) => {
	const formatTime = (ms: number) => {
		const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((ms / (1000 * 60)) % 60);
		const seconds = Math.floor((ms / 1000) % 60);
		const milliseconds = Math.floor((ms % 1000) / 10);
		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
	};

	const handleTweet = () => {
		const tweetText = [
			"#例外謎 に参加したあなたは「Riddle Time Attack」を先行体験した！",
			`セット：${selectedSetTitle}`,
			`クリアタイム：${formatTime(elapsedTime)}`,
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
				<Box mt={2} textAlign="left" sx={{ mx: "auto", maxWidth: 250 }}>
					<Typography variant="body1" sx={{ fontSize: "1.0rem" }}>
						{`・クリアタイム：${formatTime(elapsedTime)}`}
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
