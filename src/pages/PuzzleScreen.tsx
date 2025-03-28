import type React from "react";
import { useState } from "react";
import { Box, Button, Card, CardMedia, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Countdown from "../components/Countdown";
import Stopwatch from "../components/Stopwatch";
import InputAnswer from "../components/InputAnswer";
import { blue, grey } from "@mui/material/colors";
import type { RiddleSetsType } from "../utils/types";

interface PuzzleScreenProps {
	content: RiddleSetsType;
	setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
	passCount: number;
	setPassCount: React.Dispatch<React.SetStateAction<number>>;
	setPage: React.Dispatch<React.SetStateAction<"home" | "puzzle" | "result">>;
}

const PuzzleScreen: React.FC<PuzzleScreenProps> = ({
	content,
	setElapsedTime,
	passCount,
	setPassCount,
	setPage,
}) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showCountdown, setShowCountdown] = useState(true);
	const [additionalTime, setAdditionalTime] = useState(0);

	const [isRunning, setIsRunning] = useState(false);
	const [shouldGoToResult, setShouldGoToResult] = useState(false);

	const onCountdownComplete = () => {
		setShowCountdown(false);
		setIsRunning(true);
	};

	const handleAnswerSubmit = (answer: string) => {
		const correctAnswer = content.answers[currentImageIndex];
		if (answer === correctAnswer) {
			showNextImage();
		}
	};

	const handlePass = () => {
		const isLast = currentImageIndex + 1 >= content.images.length;
		setPassCount((prev) => prev + 1);
		setAdditionalTime((prev) => prev + 300000); // 5分追加

		if (isLast) {
			// 追加時間が適用されるのを待つために短い遅延を入れる
			setTimeout(() => {
				setIsRunning(false); // Stopwatch 停止
				setShouldGoToResult(true); // Stopwatch 側に画面遷移を託す
			}, 50);
		} else {
			showNextImage();
		}
	};

	const showNextImage = () => {
		const nextIndex = currentImageIndex + 1;
		if (nextIndex < content.images.length) {
			setCurrentImageIndex(nextIndex);
		} else {
			setIsRunning(false);
			setPage("result");
		}
	};

	return (
		<Box mt={1}>
			{showCountdown ? (
				<Countdown onComplete={onCountdownComplete} />
			) : (
				<>
					<Typography variant="h6" align="center" mb={2}>
						{`【${content.title}】第 ${currentImageIndex + 1} 問目`}
						<br />
						{`パス回数：${passCount}`}
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
								onComplete={() => {
									if (shouldGoToResult) {
										setPage("result");
									}
								}}
							/>
						</Box>
					</Box>
					<Card sx={{ maxWidth: 300, mx: "auto", mb: 2 }}>
						<CardMedia
							component="img"
							image={content.images[currentImageIndex]}
							sx={{
								maxHeight: 300,
								objectFit: "contain",
							}}
						/>
					</Card>
					<Box mt={1}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<InputAnswer onSubmit={handleAnswerSubmit} />
						</Box>
						<Box mt={5} display="flex" justifyContent="center">
							<Button variant="contained" onClick={handlePass}>
								パス (5分追加)
							</Button>
						</Box>
					</Box>
				</>
			)}
		</Box>
	);
};

export default PuzzleScreen;
