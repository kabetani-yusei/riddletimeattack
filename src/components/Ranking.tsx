import type React from "react";
import useRanking from "../hooks/useRanking";
import type { RankingItem } from "../hooks/useRanking";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
	IconButton,
	Tooltip,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Box,
} from "@mui/material";

const formatTimeHour = (timeStr: string) => {
	// 先頭が「00時間」なら削除（"00時間" は全角文字の場合もあるので注意）
	const cleanedTime = timeStr.startsWith("00時間") ? timeStr.slice(4) : timeStr;
	return cleanedTime;
};

interface RankingProps {
	selectedSetTitle: string;
	rankingItem: RankingItem[];
	setRankingItem: React.Dispatch<React.SetStateAction<RankingItem[]>>;
}

const Ranking: React.FC<RankingProps> = ({
	selectedSetTitle,
	rankingItem,
	setRankingItem,
}) => {
	if (rankingItem.length === 0) {
		const { rankingData, loading, error } = useRanking(selectedSetTitle);

		if (loading) return <div>読み込み中...</div>;
		if (error) return <div>エラー: {error.message}</div>;
		setRankingItem(rankingData);
	}

	return (
		<Box>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={2}
			>
				<Typography variant="h6">
					{selectedSetTitle} のランキング（Top10）
				</Typography>
				<Tooltip title="再読み込み">
					<IconButton onClick={() => setRankingItem([])}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
			</Box>
			<Table sx={{ borderCollapse: "collapse", width: "100%" }}>
				<TableHead>
					<TableRow>
						<TableCell
							align="center"
							sx={{ border: "1px solid #ccc", padding: "8px" }}
						>
							順位
						</TableCell>
						<TableCell
							align="center"
							sx={{ border: "1px solid #ccc", padding: "8px" }}
						>
							ユーザー名
						</TableCell>
						<TableCell
							align="center"
							sx={{ border: "1px solid #ccc", padding: "8px" }}
						>
							タイム
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rankingItem.map((item: RankingItem, index: number) => (
						<TableRow key={item.id ?? index}>
							<TableCell
								align="center"
								sx={{ border: "1px solid #ccc", padding: "8px" }}
							>
								{index + 1}
							</TableCell>
							<TableCell
								align="center"
								sx={{ border: "1px solid #ccc", padding: "8px" }}
							>
								{item.userName}
							</TableCell>
							<TableCell
								align="center"
								sx={{ border: "1px solid #ccc", padding: "8px" }}
							>
								{formatTimeHour(item.elapsedTime)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Box>
	);
};

export default Ranking;
