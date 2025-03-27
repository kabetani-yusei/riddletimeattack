// src/PuzzleScreen.tsx
import type React from "react";
import { useState } from "react";
import { Box, Button, Card, CardMedia, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { riddleSets } from "../utils/riddleSets";
import Countdown from "../components/Countdown";
import Stopwatch from "../components/Stopwatch";
import InputAnswer from "../components/InputAnswer";
import { blue, grey } from "@mui/material/colors";

interface PuzzleScreenProps {
	selectedSet: "setA" | "setB";
	setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
	passCount: number;
	setPassCount: React.Dispatch<React.SetStateAction<number>>;
	setPage: React.Dispatch<React.SetStateAction<"home" | "puzzle" | "result">>;
}

const PuzzleScreen: React.FC<PuzzleScreenProps> = ({
	selectedSet,
	setElapsedTime,
	passCount,
	setPassCount,
	setPage,
}) => {
	const currentImageSet = riddleSets[selectedSet];
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showCountdown, setShowCountdown] = useState(true);
	const [additionalTime, setAdditionalTime] = useState(0);
	// ストップウォッチの実行状態を管理する状態
	const [isRunning, setIsRunning] = useState(false);

	const currentSetTitle = selectedSet === "setA" ? "A" : "B";

	const onCountdownComplete = () => {
		setShowCountdown(false);
		setIsRunning(true);
	};

	const handleAnswerSubmit = (answer: string) => {
		const correctAnswer = currentImageSet.answers[currentImageIndex];
		if (answer === correctAnswer) {
			showNextImage();
		}
	};

	const handlePass = () => {
		setPassCount((prev) => prev + 1);
		setAdditionalTime((prev) => prev + 300000); // 5分追加
		showNextImage();
	};

	const showNextImage = () => {
		const nextIndex = currentImageIndex + 1;
		if (nextIndex < currentImageSet.images.length) {
			setCurrentImageIndex(nextIndex);
		} else {
			setPage("result");
		}
	};

	return (
		<Box mt={4}>
			{showCountdown ? (
				<Countdown onComplete={onCountdownComplete} />
			) : (
				<>
					<Typography variant="h6" align="center" mb={1}>
						{`【セット ${currentSetTitle} 】第 ${currentImageIndex + 1} 問目 パス回数：${passCount}`}
					</Typography>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						mb={1}
					>
						<Box
							sx={{
								border: `2px solid ${blue[700]}`,
								borderRadius: 1,
								p: 1,
								display: "flex",
								alignItems: "center",
								backgroundColor: grey[50],
							}}
						>
							<AccessTimeIcon sx={{ mr: 1 }} />
							<Stopwatch
								running={isRunning}
								additionalTime={additionalTime}
								onTimeUpdate={setElapsedTime}
							/>
						</Box>
					</Box>
					{/* 画像サイズを制限し中央寄せ */}
					<Card sx={{ maxWidth: 300, mx: "auto", mb: 2 }}>
						<CardMedia
							component="img"
							image={currentImageSet.images[currentImageIndex]}
							sx={{
								maxHeight: 300,
								objectFit: "contain",
							}}
						/>
					</Card>
					{/* 解答入力エリア */}
					<Box mt={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<InputAnswer onSubmit={handleAnswerSubmit} />
						</Box>
						{/* パスボタン：解答エリアとの間に余白を設けて下部に配置 */}
						<Box mt={2} display="flex" justifyContent="center">
							<Button variant="contained" onClick={handlePass}>
								パス (計5分追加)
							</Button>
						</Box>
					</Box>
				</>
			)}
		</Box>
	);
};

export default PuzzleScreen;
