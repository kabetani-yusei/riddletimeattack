import type React from "react";
import { useState } from "react";
import { Box, Button, Card, CardMedia, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Countdown from "../components/Countdown";
import Stopwatch from "../components/Stopwatch";
import InputAnswer from "../components/InputAnswer";
import { blue, grey } from "@mui/material/colors";
import type { RiddleSetsType } from "../utils/types";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

interface PuzzleScreenProps {
	content: RiddleSetsType;
	setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
	setHintCount: React.Dispatch<React.SetStateAction<number>>;
	passCount: number;
	setPassCount: React.Dispatch<React.SetStateAction<number>>;
	setPage: React.Dispatch<React.SetStateAction<"home" | "puzzle" | "result">>;
}

const PuzzleScreen: React.FC<PuzzleScreenProps> = ({
	content,
	setElapsedTime,
	setHintCount,
	passCount,
	setPassCount,
	setPage,
}) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showCountdown, setShowCountdown] = useState(true);
	const [additionalTime, setAdditionalTime] = useState(0);
	const [showHint, setShowHint] = useState(false);

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

	const handleHint = () => {
		// ヒントが表示されていなければヒントを表示＆1分追加
		if (!showHint) {
			setHintCount((prev) => prev + 1);
			setShowHint(true);
			setAdditionalTime((prev) => prev + 60000); // 1分追加
		}
	};

	const handlePass = () => {
		setPassCount((prev) => prev + 1);
		setAdditionalTime((prev) => prev + 180000); // 3分追加
		showNextImage();
	};

	const showNextImage = () => {
		const nextIndex = currentImageIndex + 1;
		if (nextIndex < content.images.length) {
			setCurrentImageIndex(nextIndex);
			// 次の問題に移る際はヒント表示フラグをリセット
			setShowHint(false);
		} else {
			setTimeout(() => {
				setIsRunning(false); // Stopwatch 停止
				setShouldGoToResult(true); // Stopwatch 側に画面遷移を託す
			}, 50);
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
						<Box mt={5} display="flex" justifyContent="center" gap={2}>
							<Button
								variant="contained"
								onClick={handleHint}
								disabled={showHint}
							>
								ヒント(1分追加)
							</Button>
							<Button
								variant="contained"
								onClick={handlePass}
								disabled={!showHint}
							>
								パス (3分追加)
							</Button>
						</Box>
						{showHint && (
							<Box mt={2} display="flex" justifyContent="center">
								<Box
									display="flex"
									alignItems="center"
									sx={{
										backgroundColor: "#FFF9C4", // 薄い黄色
										borderLeft: "4px solid #FFC107", // アンバー色の縦線
										borderRadius: 1,
										p: 2,
										boxShadow: 1,
										maxWidth: 300,
									}}
								>
									<LightbulbIcon sx={{ mr: 1, color: "#FFC107" }} />
									<Typography variant="body1" color="text.primary">
										{content.hints[currentImageIndex]}
									</Typography>
								</Box>
							</Box>
						)}
					</Box>
				</>
			)}
		</Box>
	);
};

export default PuzzleScreen;
