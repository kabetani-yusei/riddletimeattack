// src/hooks/useFetchRanking.ts
import { useState, useEffect, useCallback } from "react";

export interface RankingItem {
	id?: string;
	selectedSetTitle: string;
	userName: string;
	elapsedTime: string;
}

interface UseRankingReturn {
	rankingData: RankingItem[];
	loading: boolean;
	refetch: () => void;
}

// endpoint は環境変数から取得される定数なので、キャストして const として扱う
const endpoint = import.meta.env.VITE_GAS_ENDPOINT as string;

export default function useFetchRanking(): UseRankingReturn {
	const [rankingData, setRankingData] = useState<RankingItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	// endpoint は定数として扱うので、依存関係は不要とする
	const fetchRankingData = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetch(endpoint);
			if (!response.ok) {
				throw new Error("ネットワークエラーが発生しました");
			}
			const data: RankingItem[] = await response.json();
			setRankingData(data);
		} catch (err: unknown) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRankingData();
	}, [fetchRankingData]);

	const refetch = () => {
		fetchRankingData();
	};

	return { rankingData, loading, refetch };
}
