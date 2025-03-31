// src/hooks/useFormatRanking.ts
import type { RankingItem } from "./useFetchRanking";

interface UseFormatRankingReturn {
	formatRankingData: RankingItem[];
}

export default function useFormatRanking(
	selectedSetTitle: string,
	rankingData: RankingItem[],
): UseFormatRankingReturn {
	// GASから返された全データの中から、selectedSetTitle が一致するものを抽出
	const filteredData = rankingData.filter(
		(item) => item.selectedSetTitle === selectedSetTitle,
	);

	// elapsedTime を基準に昇順ソート（クリアタイムが早い順）
	filteredData.sort((a, b) => a.elapsedTime.localeCompare(b.elapsedTime));

	// 最大 10 件までに制限
	const limitedData = filteredData.slice(0, 10);

	return {
		formatRankingData: limitedData,
	};
}
