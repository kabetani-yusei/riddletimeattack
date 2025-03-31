// src/hooks/useFetchRanking.ts
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
	refetch: () => void;
}

export default function useFetchRanking(): UseRankingReturn {
	const [rankingData, setRankingData] = useState<RankingItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [refetchFlag, setRefetchFlag] = useState(0);

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
				setRankingData(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetchRankingData();
	}, []);

	const refetch = () => {
		setRefetchFlag((prev) => prev + 1);
	};

	return { rankingData, loading, refetch };
}
