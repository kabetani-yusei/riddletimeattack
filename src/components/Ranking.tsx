import type React from "react";
import useRanking from "../hooks/useRanking";
import type { RankingItem } from "../hooks/useRanking";

const formatTimeHour = (timeStr: string) => {
	// 先頭が「00時間」なら削除
	const cleanedTime = timeStr.startsWith("00時間") ? timeStr.slice(4) : timeStr;
	return cleanedTime;
};

interface RankingProps {
	selectedSetTitle: string;
	rankingItem: RankingItem[];
	setRankingItem: React.Dispatch<React.SetStateAction<RankingItem[]>>;
}

const Ranking: React.FC<RankingProps> = ({ selectedSetTitle,
	rankingItem,
	setRankingItem,
}) => {
	if(rankingItem.length === 0){
		const { rankingData, loading, error } = useRanking(selectedSetTitle);

		if (loading) return <div>読み込み中...</div>;
		if (error) return <div>エラー: {error.message}</div>;
		setRankingItem(rankingData);
	}

	return (
		<div>
			<h2>{selectedSetTitle} のランキング（Top10）</h2>
			<table style={{ borderCollapse: "collapse", width: "100%" }}>
				<thead>
					<tr>
						<th style={{ border: "1px solid #ccc", padding: "8px" }}>順位</th>
						<th style={{ border: "1px solid #ccc", padding: "8px" }}>
							ユーザー名
						</th>
						<th style={{ border: "1px solid #ccc", padding: "8px" }}>
							タイム
						</th>
					</tr>
				</thead>
				<tbody>
					{rankingItem.map((item: RankingItem, index: number) => (
						<tr key={item.id ?? index}>
							<td
								style={{
									border: "1px solid #ccc",
									padding: "8px",
									textAlign: "center",
								}}
							>
								{index + 1}
							</td>
							<td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
								{item.userName}
							</td>
							<td
								style={{
									border: "1px solid #ccc",
									padding: "8px",
									textAlign: "center",
								}}
							>
								{formatTimeHour(item.elapsedTime)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Ranking;
