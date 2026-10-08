// src/components/Ranking.tsx
import type React from "react";
import { useMemo } from "react";
import type { RankingItem } from "../hooks/useFetchRanking";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
	Box,
	Button,
	LinearProgress,
	Paper,
	Skeleton,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { riddleSets } from "../utils/riddleSets";
import type { RiddleSetKey } from "../utils/types";
import { formatTimeHour } from "../utils/time";
import { rankEntries } from "../utils/ranking";

const TOP_N = 10;
const medals = ["🥇", "🥈", "🥉"];

interface RankingProps {
	setKey: RiddleSetKey;
	onChangeSet: (key: RiddleSetKey) => void;
	rankingItem: RankingItem[];
	loading: boolean;
	error: boolean;
	updatedAt: number | null;
	refetch: () => void;
	// 自分の結果（送信直後でまだランキングに反映されていなくても表示する）
	myEntry?: RankingItem;
}

const Row: React.FC<{ rank: number; item: RankingItem; isMe: boolean }> = ({
	rank,
	item,
	isMe,
}) => (
	<Box
		sx={{
			display: "flex",
			alignItems: "center",
			gap: 1.5,
			px: 1.5,
			py: 1,
			borderRadius: 2,
			bgcolor: isMe
				? "rgba(245,158,11,0.18)"
				: rank <= 3
					? "grey.50"
					: "transparent",
			outline: isMe ? "2px solid #f59e0b" : "none",
		}}
	>
		<Box
			sx={{
				width: 32,
				textAlign: "center",
				fontWeight: 800,
				fontSize: rank <= 3 ? "1.4rem" : "1rem",
				color: "text.secondary",
				flexShrink: 0,
			}}
		>
			{rank <= 3 ? medals[rank - 1] : rank}
		</Box>
		<Typography
			sx={{
				flex: 1,
				minWidth: 0,
				fontWeight: isMe || rank <= 3 ? 700 : 500,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			}}
		>
			{item.userName}
			{isMe && (
				<Box
					component="span"
					sx={{
						ml: 1,
						px: 0.8,
						py: 0.1,
						fontSize: "0.7rem",
						borderRadius: 1,
						bgcolor: "secondary.main",
						color: "secondary.contrastText",
						verticalAlign: "middle",
					}}
				>
					あなた
				</Box>
			)}
		</Typography>
		<Typography
			sx={{
				fontVariantNumeric: "tabular-nums",
				fontWeight: 700,
				color: "primary.dark",
				flexShrink: 0,
			}}
		>
			{formatTimeHour(item.elapsedTime)}
		</Typography>
	</Box>
);

const Ranking: React.FC<RankingProps> = ({
	setKey,
	onChangeSet,
	rankingItem,
	loading,
	error,
	updatedAt,
	refetch,
	myEntry,
}) => {
	const selectedSetTitle = riddleSets[setKey].title;
	const { entries, myIndex } = useMemo(
		() => rankEntries(selectedSetTitle, rankingItem, myEntry),
		[selectedSetTitle, rankingItem, myEntry],
	);
	const top = entries.slice(0, TOP_N);
	const showMeBelow = myIndex >= TOP_N;
	const noData = rankingItem.length === 0;

	return (
		<Paper
			elevation={0}
			sx={{ p: { xs: 2, sm: 3 }, position: "relative", overflow: "hidden" }}
		>
			{loading && !noData && (
				<LinearProgress
					sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
				/>
			)}
			<Box display="flex" alignItems="center" gap={1} mb={1.5}>
				<EmojiEventsIcon sx={{ color: "secondary.main" }} />
				<Typography variant="h6" sx={{ fontWeight: 800, flex: 1 }}>
					ランキング
					<Typography
						component="span"
						sx={{ ml: 1, color: "text.secondary", fontSize: "0.85rem" }}
					>
						Top{TOP_N}
					</Typography>
				</Typography>
			</Box>
			<ToggleButtonGroup
				exclusive
				fullWidth
				size="small"
				color="primary"
				value={setKey}
				onChange={(_e, value: RiddleSetKey | null) =>
					value && onChangeSet(value)
				}
				sx={{ mb: 1.5 }}
			>
				{Object.entries(riddleSets).map(([key, setContent]) => (
					<ToggleButton key={key} value={key} sx={{ fontWeight: 700 }}>
						{setContent.title}
					</ToggleButton>
				))}
			</ToggleButtonGroup>

			{noData && loading ? (
				<Box display="flex" flexDirection="column" gap={1}>
					{Array.from({ length: 5 }, (_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: スケルトン表示用
						<Skeleton key={i} variant="rounded" height={40} />
					))}
				</Box>
			) : top.length === 0 ? (
				<Typography
					sx={{ py: 4, textAlign: "center", color: "text.secondary" }}
				>
					{error
						? "ランキングを取得できませんでした"
						: "まだ記録がありません。一番乗りを目指そう！"}
				</Typography>
			) : (
				<Box display="flex" flexDirection="column" gap={0.5}>
					{top.map((item, index) => (
						<Row
							key={item.id ?? `${item.userName}-${item.elapsedTime}-${index}`}
							rank={index + 1}
							item={item}
							isMe={index === myIndex}
						/>
					))}
					{showMeBelow && myEntry && (
						<>
							<Typography
								sx={{
									textAlign: "center",
									color: "text.disabled",
									lineHeight: 1,
								}}
							>
								⋮
							</Typography>
							<Row rank={myIndex + 1} item={myEntry} isMe />
						</>
					)}
				</Box>
			)}

			<Box
				mt={2}
				display="flex"
				flexDirection="column"
				alignItems="center"
				gap={0.5}
			>
				<Button
					variant="outlined"
					startIcon={<RefreshIcon />}
					onClick={refetch}
					disabled={loading}
					fullWidth
				>
					{loading ? "読み込み中…" : "ランキングを再読み込み"}
				</Button>
				<Typography
					variant="caption"
					color={error ? "error" : "text.secondary"}
				>
					{error
						? "通信に失敗しました。時間をおいて再読み込みしてください"
						: updatedAt
							? `最終更新 ${new Date(updatedAt).toLocaleTimeString("ja-JP")}`
							: ""}
				</Typography>
			</Box>
		</Paper>
	);
};

export default Ranking;
