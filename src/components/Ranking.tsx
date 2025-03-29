import type React from "react";
import useRanking from "../hooks/useRanking";
import type { RankingItem } from "../hooks/useRanking";

interface RankingProps {
	selectedSetTitle: string;
}

const Ranking: React.FC<RankingProps> = ({ selectedSetTitle }) => {
	const { rankingData, loading, error } = useRanking(selectedSetTitle);

	if (loading) return <div>読み込み中...</div>;
	if (error) return <div>エラー: {error.message}</div>;

	return (
		<div>
			<h2>{selectedSetTitle} のランキング</h2>
			<table style={{ borderCollapse: "collapse", width: "100%" }}>
				<thead>
					<tr>
						<th style={{ border: "1px solid #ccc", padding: "8px" }}>順位</th>
						<th style={{ border: "1px solid #ccc", padding: "8px" }}>
							ユーザー名
						</th>
						<th style={{ border: "1px solid #ccc", padding: "8px" }}>
							経過時間 (秒)
						</th>
						<th style={{ border: "1px solid #ccc", padding: "8px" }}>
							パス回数
						</th>
					</tr>
				</thead>
				<tbody>
					{rankingData.map((item: RankingItem, index: number) => (
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
							<td style={{ border: "1px solid #ccc", padding: "8px" }}>
								{item.userName}
							</td>
							<td
								style={{
									border: "1px solid #ccc",
									padding: "8px",
									textAlign: "right",
								}}
							>
								{item.elapsedTime}
							</td>
							<td
								style={{
									border: "1px solid #ccc",
									padding: "8px",
									textAlign: "right",
								}}
							>
								{item.passCount}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Ranking;
