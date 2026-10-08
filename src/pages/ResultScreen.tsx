// src/ResultScreen.tsx
import type React from "react";
import { useMemo, useState } from "react";
import { Box, Button, Paper, Snackbar, Stack, Typography } from "@mui/material";
import XIcon from "@mui/icons-material/X";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Ranking from "../components/Ranking";
import { rankEntries } from "../utils/ranking";
import QuestionProgress from "../components/QuestionProgress";
import type useFetchRanking from "../hooks/useFetchRanking";
import type { RankingItem } from "../hooks/useFetchRanking";
import type { GameState, RiddleSetKey } from "../utils/types";
import { riddleSets } from "../utils/riddleSets";
import { formatClock, formatTime, formatTimeHour } from "../utils/time";
import {
	APP_NAME,
	APP_URL,
	HINT_PENALTY_MS,
	PASS_PENALTY_MS,
} from "../utils/constants";

interface ResultScreenProps {
	game: GameState;
	userName: string;
	ranking: ReturnType<typeof useFetchRanking>;
	rankingSet: RiddleSetKey;
	setRankingSet: (key: RiddleSetKey) => void;
	onBackToTitle: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
	game,
	userName,
	ranking,
	rankingSet,
	setRankingSet,
	onBackToTitle,
}) => {
	const [copied, setCopied] = useState(false);
	const content = riddleSets[game.setKey];
	const elapsedTime = game.finishedTime ?? 0;
	const timeText = formatTimeHour(formatTime(elapsedTime));
	const penaltyMs =
		game.hintCount * HINT_PENALTY_MS + game.passCount * PASS_PENALTY_MS;
	const correctCount = game.results.filter((r) => r === "correct").length;

	const myEntry: RankingItem = useMemo(
		() => ({
			selectedSetTitle: content.title,
			userName,
			elapsedTime: formatTime(elapsedTime),
		}),
		[content.title, userName, elapsedTime],
	);
	const { myIndex } = useMemo(
		() => rankEntries(content.title, ranking.rankingData, myEntry),
		[content.title, ranking.rankingData, myEntry],
	);

	const shareText = [
		`「${APP_NAME}」を遊びました！`,
		`セット：${content.title}`,
		`タイム：${timeText}`,
		`ヒント回数：${game.hintCount}回`,
		`パス回数：${game.passCount}回`,
		"",
		"みんなで結果を共有して競い合おう！",
		APP_URL,
		"#RiddleTA",
	].join("\n");

	const handleTweet = () => {
		window.open(
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
			"_blank",
		);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareText);
			setCopied(true);
		} catch {
			// クリップボードが使えない環境では何もしない
		}
	};

	const stat = (label: string, value: string, sub?: string) => (
		<Box sx={{ flex: 1, textAlign: "center" }}>
			<Typography variant="caption" color="text.secondary" fontWeight={700}>
				{label}
			</Typography>
			<Typography sx={{ fontSize: "1.4rem", fontWeight: 900, lineHeight: 1.3 }}>
				{value}
			</Typography>
			{sub && (
				<Typography variant="caption" color="text.secondary">
					{sub}
				</Typography>
			)}
		</Box>
	);

	return (
		<Stack spacing={2.5} sx={{ py: { xs: 3, sm: 5 } }}>
			<Box textAlign="center" color="white">
				<Typography
					sx={{
						fontWeight: 900,
						fontSize: "2.4rem",
						lineHeight: 1,
						color: "#fde68a",
					}}
				>
					CLEAR!
				</Typography>
				<Typography sx={{ mt: 1, opacity: 0.85, fontWeight: 700 }}>
					{content.title}・{userName} さん
				</Typography>
			</Box>

			<Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 } }}>
				<Typography textAlign="center" color="text.secondary" fontWeight={700}>
					クリアタイム
				</Typography>
				<Typography
					textAlign="center"
					sx={{
						fontSize: { xs: "3rem", sm: "3.6rem" },
						fontWeight: 900,
						lineHeight: 1.1,
						fontVariantNumeric: "tabular-nums",
						color: "primary.dark",
					}}
				>
					{formatClock(elapsedTime)}
				</Typography>
				{penaltyMs > 0 && (
					<Typography textAlign="center" variant="body2" color="text.secondary">
						（ペナルティ +{penaltyMs / 60000}分 を含む）
					</Typography>
				)}
				<Box mt={2}>
					<QuestionProgress
						total={content.images.length}
						current={-1}
						results={game.results}
					/>
				</Box>
				<Box
					display="flex"
					mt={2}
					sx={{ bgcolor: "grey.50", borderRadius: 3, py: 1.5 }}
				>
					{stat("正解", `${correctCount}/${content.images.length}`)}
					{stat("ヒント", `${game.hintCount}回`)}
					{stat("パス", `${game.passCount}回`)}
					{stat(
						"順位",
						myIndex >= 0 ? `${myIndex + 1}位` : "-",
						ranking.loading ? "更新中…" : undefined,
					)}
				</Box>
				<Stack spacing={1.2} mt={2.5}>
					<Button
						variant="contained"
						size="large"
						onClick={handleTweet}
						startIcon={<XIcon />}
						sx={{ bgcolor: "#000", "&:hover": { bgcolor: "#222" } }}
					>
						Xで結果をポスト
					</Button>
					<Button
						variant="outlined"
						onClick={handleCopy}
						startIcon={<ContentCopyRoundedIcon />}
					>
						結果テキストをコピー
					</Button>
					<Typography
						variant="caption"
						color="text.secondary"
						textAlign="center"
					>
						※ SNSへの投稿は結果のみでお願いします（問題・答えのネタバレはNG）
					</Typography>
				</Stack>
			</Paper>

			<Ranking
				setKey={rankingSet}
				onChangeSet={setRankingSet}
				rankingItem={ranking.rankingData}
				loading={ranking.loading}
				error={ranking.error}
				updatedAt={ranking.updatedAt}
				refetch={ranking.refetch}
				myEntry={myEntry}
			/>

			<Button
				variant="contained"
				size="large"
				onClick={onBackToTitle}
				startIcon={<HomeRoundedIcon />}
				sx={{
					bgcolor: "rgba(255,255,255,0.15)",
					"&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
				}}
			>
				タイトルに戻る
			</Button>

			<Snackbar
				open={copied}
				autoHideDuration={2000}
				onClose={() => setCopied(false)}
				message="結果をコピーしました"
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			/>
		</Stack>
	);
};

export default ResultScreen;
