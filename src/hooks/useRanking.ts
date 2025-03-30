import { useState, useEffect } from "react";

export interface RankingItem {
	id?: string;
	selectedSetTitle: string;
	userName: string;
	elapsedTime: string;
}

interface UseRankingReturn {
	rankingData: RankingItem[];
	loading: boolean;
	error: Error | null;
}

export default function useRanking(selectedSetTitle: string): UseRankingReturn {
	const [rankingData, setRankingData] = useState<RankingItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const endpoint = import.meta.env.VITE_GAS_ENDPOINT;

	useEffect(() => {
		async function fetchRankingData() {
			setLoading(true);
			try {
				const response = await fetch(endpoint);
				if (!response.ok) {
					throw new Error("ネットワークエラーが発生しました");
				}
				const data: RankingItem[] = await response.json();

				// GASから返された全データの中から、selectedSetTitle が一致するものを抽出
				const filteredData = data.filter(
					(item) => item.selectedSetTitle === selectedSetTitle,
				);

				// elapsedTime を基準に昇順ソート（クリアタイムが早い順）
				filteredData.sort((a, b) => a.elapsedTime.localeCompare(b.elapsedTime));

				// 最大 10 件までに制限
				const limitedData = filteredData.slice(0, 10);
				setRankingData(limitedData);
			} catch (err) {
				console.error(err);
				if (err instanceof Error) {
					setError(err);
				} else {
					setError(new Error("不明なエラーが発生しました"));
				}
			} finally {
				setLoading(false);
			}
		}
		fetchRankingData();
	}, [selectedSetTitle]);

	return { rankingData, loading, error };
}
