// src/hooks/useFetchRanking.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { readStorage, writeStorage } from "./usePersistentState";

export interface RankingItem {
	id?: string;
	selectedSetTitle: string;
	userName: string;
	elapsedTime: string;
}

interface UseRankingReturn {
	rankingData: RankingItem[];
	loading: boolean;
	error: boolean;
	updatedAt: number | null;
	refetch: () => Promise<void>;
}

// endpoint は環境変数から取得される定数なので、キャストして const として扱う
const endpoint = import.meta.env.VITE_GAS_ENDPOINT as string;
const CACHE_KEY = "rta:rankingCache";

interface RankingCache {
	data: RankingItem[];
	updatedAt: number | null;
}

export default function useFetchRanking(): UseRankingReturn {
	// 前回取得したランキングを即座に表示し、裏で最新を取得する
	const [cache, setCache] = useState<RankingCache>(() =>
		readStorage<RankingCache>(
			CACHE_KEY,
			{ data: [], updatedAt: null },
			"local",
		),
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const inFlight = useRef<Promise<void> | null>(null);

	const refetch = useCallback(() => {
		// 同時に複数回リクエストしない
		if (inFlight.current) return inFlight.current;
		setLoading(true);
		const request = (async () => {
			try {
				const response = await fetch(endpoint);
				if (!response.ok) {
					throw new Error("ネットワークエラーが発生しました");
				}
				const data: RankingItem[] = await response.json();
				const next = { data, updatedAt: Date.now() };
				setCache(next);
				writeStorage(CACHE_KEY, next, "local");
				setError(false);
			} catch (err: unknown) {
				console.error(err);
				setError(true);
			} finally {
				setLoading(false);
				inFlight.current = null;
			}
		})();
		inFlight.current = request;
		return request;
	}, []);

	useEffect(() => {
		refetch();
	}, [refetch]);

	return {
		rankingData: cache.data,
		updatedAt: cache.updatedAt,
		loading,
		error,
		refetch,
	};
}
