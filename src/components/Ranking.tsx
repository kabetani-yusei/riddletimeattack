// src/components/Ranking.tsx
import type React from "react";
import { useMemo } from "react";
import useFormatRanking from "../hooks/useFormatRanking";
import type { RankingItem } from "../hooks/useFetchRanking";
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
	CircularProgress,
} from "@mui/material";

const formatTimeHour = (timeStr: string) => {
	// 先頭が「00時間」なら削除（全角文字の場合も考慮）
	return timeStr.startsWith("00時間") ? timeStr.slice(4) : timeStr;
};

interface RankingProps {
	selectedSetTitle: string;
	rankingItem: RankingItem[];
	loading: boolean;
	refetch: () => void;
}

const Ranking: React.FC<RankingProps> = ({
	selectedSetTitle,
	rankingItem,
	loading,
	refetch,
}) => {
	// rankingItem と selectedSetTitle から整形済みランキングを算出
	const formattedRanking = useMemo(() => {
		const { formatRankingData } = useFormatRanking(
			selectedSetTitle,
			rankingItem,
		);
		return formatRankingData;
	}, [selectedSetTitle, rankingItem]);

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight={200}
			>
				<CircularProgress />
			</Box>
		);
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
					<IconButton onClick={refetch}>
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
					{formattedRanking.map((item: RankingItem, index: number) => (
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
