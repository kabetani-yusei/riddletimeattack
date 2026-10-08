import type React from "react";
import {
	Box,
	Button,
	Paper,
	Stack,
	Tab,
	Tabs,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { riddleSets } from "../utils/riddleSets";
import type { RiddleSetKey } from "../utils/types";
import { QUESTION_COUNT } from "../utils/constants";
import Ranking from "../components/Ranking";
import type useFetchRanking from "../hooks/useFetchRanking";
import useImagePreload from "../hooks/useImagePreload";

export const USER_NAME_MAX = 20;

interface Props {
	tab: number;
	setTab: (tab: number) => void;
	selectedSet: RiddleSetKey;
	setSelectedSet: (key: RiddleSetKey) => void;
	rankingSet: RiddleSetKey;
	setRankingSet: (key: RiddleSetKey) => void;
	userName: string;
	setUserName: (name: string) => void;
	onStart: (ranked: boolean) => void;
	ranking: ReturnType<typeof useFetchRanking>;
}

const rules: { icon: React.ReactNode; text: React.ReactNode }[] = [
	{
		icon: <TimerOutlinedIcon />,
		text: (
			<>
				全<b>{QUESTION_COUNT}問</b>の謎を解ききるまでのタイムを競います
			</>
		),
	},
	{
		icon: <EditOutlinedIcon />,
		text: "答えは全てひらがなで入力してください",
	},
	{
		icon: <LightbulbOutlinedIcon />,
		text: (
			<>
				わからないときはヒントを見られます（<b>+1分</b>）
			</>
		),
	},
	{
		icon: <SkipNextOutlinedIcon />,
		text: (
			<>
				ヒントを見ても分からなければパスできます（<b>+3分</b>）
			</>
		),
	},
	{
		icon: <RestartAltOutlinedIcon />,
		text: (
			<>
				リロードしても続きから再開できます（タイマーは止まりません）。
				プレイ中はブラウザの戻る操作は使えません
			</>
		),
	},
];

const HomeScreen: React.FC<Props> = ({
	tab,
	setTab,
	selectedSet,
	setSelectedSet,
	rankingSet,
	setRankingSet,
	userName,
	setUserName,
	onStart,
	ranking,
}) => {
	const trimmedName = userName.trim();
	// 選択中のセットの画像を先に読み込んでおく
	const preload = useImagePreload(riddleSets[selectedSet].images);

	return (
		<Stack spacing={2.5} sx={{ py: { xs: 3, sm: 5 } }}>
			<Box textAlign="center" color="white">
				<Typography
					sx={{
						fontSize: { xs: "2.1rem", sm: "2.6rem" },
						fontWeight: 900,
						lineHeight: 1.1,
						letterSpacing: "0.01em",
						background: "linear-gradient(90deg, #fff 0%, #fde68a 100%)",
						WebkitBackgroundClip: "text",
						backgroundClip: "text",
						color: "transparent",
					}}
				>
					Riddle Time Attack
				</Typography>
				<Typography sx={{ mt: 1, opacity: 0.85, fontWeight: 700 }}>
					謎解きタイムアタック
				</Typography>
				<Box
					sx={{
						mt: 2,
						display: "inline-flex",
						alignItems: "baseline",
						gap: 0.5,
						px: 2.5,
						py: 0.5,
						borderRadius: 999,
						bgcolor: "secondary.main",
						color: "secondary.contrastText",
						fontWeight: 900,
						boxShadow: "0 6px 20px rgba(245,158,11,0.4)",
					}}
				>
					<Typography component="span" sx={{ fontWeight: 900 }}>
						全
					</Typography>
					<Typography
						component="span"
						sx={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}
					>
						{QUESTION_COUNT}
					</Typography>
					<Typography component="span" sx={{ fontWeight: 900 }}>
						問
					</Typography>
				</Box>
			</Box>

			<Tabs
				value={tab}
				onChange={(_event, newValue) => setTab(newValue)}
				variant="fullWidth"
				sx={{
					bgcolor: "rgba(255,255,255,0.12)",
					borderRadius: 999,
					minHeight: 44,
					p: 0.5,
					"& .MuiTabs-indicator": {
						height: "100%",
						borderRadius: 999,
						bgcolor: "white",
						zIndex: 0,
					},
					"& .MuiTab-root": {
						zIndex: 1,
						minHeight: 36,
						fontWeight: 800,
						color: "rgba(255,255,255,0.85)",
					},
					"& .MuiTab-root.Mui-selected": { color: "primary.dark" },
				}}
			>
				<Tab label="あそぶ" />
				<Tab label="ランキング" />
			</Tabs>

			{tab === 0 && (
				<Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 } }}>
					<Stack spacing={2.5}>
						<Box>
							<Typography sx={{ fontWeight: 800, mb: 1 }}>
								謎セットを選択
							</Typography>
							<ToggleButtonGroup
								exclusive
								fullWidth
								color="primary"
								value={selectedSet}
								onChange={(_e, value: RiddleSetKey | null) =>
									value && setSelectedSet(value)
								}
							>
								{Object.entries(riddleSets).map(([key, setContent]) => (
									<ToggleButton
										key={key}
										value={key}
										sx={{
											py: 1.5,
											fontWeight: 800,
											fontSize: "1rem",
											flexDirection: "column",
										}}
									>
										{setContent.title}
										<Typography
											component="span"
											variant="caption"
											sx={{ opacity: 0.7 }}
										>
											{setContent.images.length}問
										</Typography>
									</ToggleButton>
								))}
							</ToggleButtonGroup>
						</Box>
						<TextField
							required
							label="ランキング掲載用のユーザー名"
							value={userName}
							onChange={(e) =>
								setUserName(e.target.value.slice(0, USER_NAME_MAX))
							}
							onKeyDown={(e) => {
								if (
									e.key === "Enter" &&
									!e.nativeEvent.isComposing &&
									e.keyCode !== 229 &&
									trimmedName
								) {
									onStart(true);
								}
							}}
							fullWidth
							helperText={
								trimmedName
									? `${userName.length}/${USER_NAME_MAX}`
									: "ユーザー名を入力するとランキングに参加できます"
							}
							slotProps={{
								formHelperText: {
									sx: { textAlign: trimmedName ? "right" : "left" },
								},
							}}
						/>
						<Stack
							spacing={1.2}
							sx={{ bgcolor: "grey.50", borderRadius: 3, p: 2 }}
						>
							{rules.map((rule, i) => (
								<Box
									// biome-ignore lint/suspicious/noArrayIndexKey: 固定の説明文
									key={i}
									display="flex"
									alignItems="flex-start"
									gap={1.2}
								>
									<Box
										sx={{ color: "primary.main", display: "flex", mt: "1px" }}
									>
										{rule.icon}
									</Box>
									<Typography sx={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
										{rule.text}
									</Typography>
								</Box>
							))}
						</Stack>
						<Button
							variant="contained"
							color="secondary"
							size="large"
							onClick={() => onStart(true)}
							disabled={!trimmedName}
							startIcon={<PlayArrowRoundedIcon />}
							sx={{ fontSize: "1.2rem", py: 1.5 }}
						>
							スタート
						</Button>
						<Button
							variant="outlined"
							onClick={() => onStart(false)}
							sx={{ mt: "12px !important" }}
						>
							ランキングに載せずに遊ぶ
						</Button>
						<Typography
							variant="caption"
							color="text.secondary"
							textAlign="center"
							sx={{ mt: "4px !important" }}
						>
							名前の入力は不要です。2周目や練習にどうぞ
						</Typography>
						{!preload.done && (
							<Typography
								variant="caption"
								color="text.secondary"
								textAlign="center"
							>
								問題画像を読み込み中… {preload.loaded}/{preload.total}
							</Typography>
						)}
					</Stack>
				</Paper>
			)}
			{tab === 1 && (
				<Ranking
					setKey={rankingSet}
					onChangeSet={setRankingSet}
					rankingItem={ranking.rankingData}
					loading={ranking.loading}
					error={ranking.error}
					updatedAt={ranking.updatedAt}
					refetch={ranking.refetch}
				/>
			)}
		</Stack>
	);
};

export default HomeScreen;
