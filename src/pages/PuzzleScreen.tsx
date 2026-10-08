import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Countdown from "../components/Countdown";
import Stopwatch from "../components/Stopwatch";
import InputAnswer from "../components/InputAnswer";
import QuestionProgress from "../components/QuestionProgress";
import EffectOverlay from "../components/EffectOverlay";
import {
	EFFECT_DURATIONS,
	type Effect,
	type EffectKind,
} from "../utils/effects";
import type { GameState, RiddleSetsType } from "../utils/types";
import { HINT_PENALTY_MS, PASS_PENALTY_MS } from "../utils/constants";
import useImagePreload from "../hooks/useImagePreload";

const penaltyFloat = keyframes`
  0% { transform: translateY(-4px); opacity: 0; }
  15% { transform: translateY(0); opacity: 1; }
  75% { opacity: 1; }
  100% { transform: translateY(4px); opacity: 0; }
`;

interface PuzzleScreenProps {
	content: RiddleSetsType;
	game: GameState;
	setGame: React.Dispatch<React.SetStateAction<GameState | null>>;
	onFinish: () => void;
}

const PuzzleScreen: React.FC<PuzzleScreenProps> = ({
	content,
	game,
	setGame,
	onFinish,
}) => {
	const [effect, setEffect] = useState<Effect | null>(null);
	const [zoom, setZoom] = useState(false);
	const preload = useImagePreload(content.images);
	const total = content.images.length;
	const finished = game.finishedTime != null;

	const playEffect = useCallback((kind: EffectKind) => {
		setEffect({ id: Date.now(), kind });
	}, []);

	// 全問終了したら演出を見せてから結果画面へ
	useEffect(() => {
		if (!finished) return;
		const timer = setTimeout(onFinish, EFFECT_DURATIONS.clear);
		return () => clearTimeout(timer);
	}, [finished, onFinish]);

	const updateGame = (updater: (g: GameState) => GameState) =>
		setGame((prev) => (prev ? updater(prev) : prev));

	const onCountdownComplete = useCallback(() => {
		setGame((prev) =>
			prev && prev.startedAt == null
				? { ...prev, startedAt: Date.now() }
				: prev,
		);
	}, [setGame]);

	const goNext = (result: "correct" | "pass", extraPenalty: number) => {
		const isLast = game.index + 1 >= total;
		updateGame((g) => {
			const penalty = g.penalty + extraPenalty;
			const results = [...g.results];
			results[g.index] = result;
			if (g.index + 1 >= total) {
				return {
					...g,
					penalty,
					results,
					finishedTime: Date.now() - (g.startedAt ?? Date.now()) + penalty,
				};
			}
			return { ...g, penalty, results, index: g.index + 1, hintShown: false };
		});
		playEffect(isLast ? "clear" : result === "pass" ? "pass" : "correct");
	};

	const handleAnswerSubmit = (answer: string) => {
		if (finished) return false;
		if (answer === content.answers[game.index]) {
			goNext("correct", 0);
			return true;
		}
		return false;
	};

	const handleHint = () => {
		if (game.hintShown || finished) return;
		updateGame((g) => ({
			...g,
			hintShown: true,
			hintCount: g.hintCount + 1,
			penalty: g.penalty + HINT_PENALTY_MS,
		}));
		playEffect("hint");
	};

	const handlePass = () => {
		if (!game.hintShown || finished) return;
		updateGame((g) => ({ ...g, passCount: g.passCount + 1 }));
		goNext("pass", PASS_PENALTY_MS);
	};

	if (game.startedAt == null) {
		return (
			<Countdown
				ready={preload.done}
				progress={preload.loaded / preload.total}
				setTitle={content.title}
				onComplete={onCountdownComplete}
			/>
		);
	}

	const displayIndex = Math.min(game.index, total - 1);

	return (
		<Box
			sx={{
				height: "100dvh",
				display: "flex",
				flexDirection: "column",
				gap: 1.5,
				py: 1.5,
				color: "white",
			}}
		>
			{/* ヘッダー：問題番号・タイマー・進捗 */}
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				gap={1}
			>
				<Box display="flex" alignItems="baseline" gap={0.5}>
					<Typography
						sx={{
							fontWeight: 700,
							opacity: 0.75,
							fontSize: "0.85rem",
							mr: 0.5,
						}}
					>
						{content.title}
					</Typography>
					<Typography sx={{ fontWeight: 900, fontSize: "1rem" }}>Q</Typography>
					<Typography
						sx={{
							fontWeight: 900,
							fontSize: "2.2rem",
							lineHeight: 1,
							color: "#fde68a",
							fontVariantNumeric: "tabular-nums",
						}}
					>
						{displayIndex + 1}
					</Typography>
					<Typography
						sx={{ fontWeight: 800, opacity: 0.8, fontSize: "1.1rem" }}
					>
						/ {total}
					</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 0.75,
						px: 1.5,
						py: 0.5,
						borderRadius: 999,
						bgcolor: "rgba(0,0,0,0.25)",
						border: "1px solid rgba(255,255,255,0.2)",
						position: "relative",
					}}
				>
					{/* ペナルティはタイマーの下に小さく表示し、問題は隠さない */}
					{(effect?.kind === "hint" || effect?.kind === "pass") && (
						<Typography
							key={effect.id}
							sx={{
								position: "absolute",
								top: 0,
								bottom: 0,
								right: "100%",
								mr: 1,
								display: "flex",
								alignItems: "center",
								fontWeight: 900,
								fontSize: "0.95rem",
								color: effect.kind === "pass" ? "#fca5a5" : "#fcd34d",
								pointerEvents: "none",
								whiteSpace: "nowrap",
								animation: `${penaltyFloat} ${EFFECT_DURATIONS[effect.kind]}ms ease-out both`,
							}}
						>
							{effect.kind === "pass" ? "+3:00" : "+1:00"}
						</Typography>
					)}
					<AccessTimeIcon fontSize="small" />
					<Stopwatch
						startedAt={game.startedAt}
						penalty={game.penalty}
						finishedTime={game.finishedTime}
						sx={{ fontSize: "1.35rem" }}
					/>
				</Box>
			</Box>
			<QuestionProgress
				total={total}
				current={game.index}
				results={game.results}
			/>
			<Box display="flex" justifyContent="flex-end" gap={1.5} sx={{ mt: -0.5 }}>
				<Typography variant="caption" sx={{ opacity: 0.8 }}>
					ヒント {game.hintCount}回
				</Typography>
				<Typography variant="caption" sx={{ opacity: 0.8 }}>
					パス {game.passCount}回
				</Typography>
			</Box>

			{/* 問題画像：全画像を重ねて描画しておき、表示だけ切り替えることで即座に切り替わる */}
			<Box
				sx={{
					flex: 1,
					minHeight: 160,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					containerType: "size",
				}}
			>
				<Box
					onClick={() => setZoom(true)}
					sx={{
						position: "relative",
						width: "min(100cqw, 100cqh)",
						height: "min(100cqw, 100cqh)",
						bgcolor: "white",
						borderRadius: 4,
						overflow: "hidden",
						boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
						cursor: "zoom-in",
					}}
				>
					{content.images.map((src, i) => (
						<Box
							key={src}
							component="img"
							src={src}
							alt={`第${i + 1}問`}
							draggable={false}
							sx={{
								position: "absolute",
								inset: 0,
								width: "100%",
								height: "100%",
								objectFit: "contain",
								visibility: i === displayIndex ? "visible" : "hidden",
							}}
						/>
					))}
					<IconButton
						size="small"
						aria-label="拡大"
						sx={{
							position: "absolute",
							right: 6,
							bottom: 6,
							bgcolor: "rgba(0,0,0,0.45)",
							color: "white",
							"&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
						}}
					>
						<ZoomInRoundedIcon fontSize="small" />
					</IconButton>
				</Box>
			</Box>

			{game.hintShown && (
				<Box
					display="flex"
					alignItems="center"
					gap={1}
					sx={{
						bgcolor: "#fff8e1",
						color: "text.primary",
						borderLeft: "5px solid #f59e0b",
						borderRadius: 2,
						px: 1.5,
						py: 1,
					}}
				>
					<LightbulbIcon sx={{ color: "#f59e0b" }} />
					<Typography sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
						{content.hints[displayIndex]}
					</Typography>
				</Box>
			)}

			<InputAnswer onSubmit={handleAnswerSubmit} />

			<Box display="flex" gap={1}>
				<Button
					fullWidth
					variant="outlined"
					onClick={handleHint}
					disabled={game.hintShown || finished}
					startIcon={<LightbulbIcon />}
					sx={{
						color: "white",
						borderColor: "rgba(255,255,255,0.5)",
						"&:hover": {
							borderColor: "white",
							bgcolor: "rgba(255,255,255,0.08)",
						},
						"&.Mui-disabled": {
							color: "rgba(255,255,255,0.4)",
							borderColor: "rgba(255,255,255,0.2)",
						},
					}}
				>
					ヒント（+1分）
				</Button>
				<Button
					fullWidth
					variant="outlined"
					onClick={handlePass}
					disabled={!game.hintShown || finished}
					startIcon={<SkipNextRoundedIcon />}
					sx={{
						color: "#fecaca",
						borderColor: "rgba(254,202,202,0.6)",
						"&:hover": {
							borderColor: "#fecaca",
							bgcolor: "rgba(239,68,68,0.12)",
						},
						"&.Mui-disabled": {
							color: "rgba(255,255,255,0.4)",
							borderColor: "rgba(255,255,255,0.2)",
						},
					}}
				>
					パス（+3分）
				</Button>
			</Box>

			<Dialog
				open={zoom}
				onClose={() => setZoom(false)}
				fullScreen
				slotProps={{
					paper: { sx: { bgcolor: "rgba(0,0,0,0.92)", borderRadius: 0 } },
				}}
			>
				<Box
					onClick={() => setZoom(false)}
					sx={{
						position: "relative",
						width: "100%",
						height: "100%",
						overflow: "auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box
						component="img"
						src={content.images[displayIndex]}
						alt={`第${displayIndex + 1}問（拡大）`}
						sx={{
							maxWidth: "100%",
							maxHeight: "100%",
							objectFit: "contain",
							bgcolor: "white",
						}}
					/>
					<IconButton
						aria-label="閉じる"
						sx={{
							position: "fixed",
							top: 12,
							right: 12,
							bgcolor: "rgba(255,255,255,0.15)",
							color: "white",
						}}
					>
						<CloseRoundedIcon />
					</IconButton>
				</Box>
			</Dialog>

			<EffectOverlay effect={effect} onDone={() => setEffect(null)} />
		</Box>
	);
};

export default PuzzleScreen;
