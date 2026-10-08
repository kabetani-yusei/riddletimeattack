import type { RankingItem } from "../hooks/useFetchRanking";

const isSameEntry = (a: RankingItem, b: RankingItem) =>
	a.selectedSetTitle === b.selectedSetTitle &&
	a.userName === b.userName &&
	a.elapsedTime === b.elapsedTime;

export const rankEntries = (
	selectedSetTitle: string,
	rankingItem: RankingItem[],
	myEntry?: RankingItem,
) => {
	const filtered = rankingItem.filter(
		(item) => item.selectedSetTitle === selectedSetTitle,
	);
	if (
		myEntry &&
		myEntry.selectedSetTitle === selectedSetTitle &&
		!filtered.some((item) => isSameEntry(item, myEntry))
	) {
		filtered.push(myEntry);
	}
	// elapsedTime（00時間05分03秒12 形式）を基準に昇順ソート
	filtered.sort((a, b) => a.elapsedTime.localeCompare(b.elapsedTime));
	const myIndex = myEntry
		? filtered.findIndex((item) => isSameEntry(item, myEntry))
		: -1;
	return { entries: filtered, myIndex };
};
