// src/App.tsx
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Snackbar } from "@mui/material";
import useFetchRanking from "../hooks/useFetchRanking";
import usePersistentState from "../hooks/usePersistentState";
import { preloadImages } from "../hooks/useImagePreload";
import useBlockBackNavigation from "../hooks/useBlockBackNavigation";
import PuzzleScreen from "./PuzzleScreen";
import ResultScreen from "./ResultScreen";
import HomeScreen from "./HomeScreen";
import { riddleSets } from "../utils/riddleSets";
import { sendToGAS } from "../hooks/useSendToGAS";
import { formatTime } from "../utils/time";
import type { GameState, Page, RiddleSetKey } from "../utils/types";

const createGame = (setKey: RiddleSetKey, ranked: boolean): GameState => ({
	setKey,
	index: 0,
	startedAt: null,
	penalty: 0,
	hintShown: false,
	hintCount: 0,
	passCount: 0,
	results: [],
	finishedTime: null,
	submitted: false,
	ranked,
});

const App: React.FC = () => {
	// 画面と進行状況はすべて保存し、リロードしても同じ画面に戻れるようにする
	const [page, setPage] = usePersistentState<Page>("rta:page", "home");
	const [game, setGame] = usePersistentState<GameState | null>(
		"rta:game",
		null,
	);
	const [selectedSet, setSelectedSet] = usePersistentState<RiddleSetKey>(
		"rta:selectedSet",
		"setA",
	);
	const [userName, setUserName] = usePersistentState(
		"rta:userName",
		"",
		"local",
	);
	const [homeTab, setHomeTab] = usePersistentState("rta:homeTab", 0);
	const [rankingSet, setRankingSet] = usePersistentState<RiddleSetKey>(
		"rta:rankingSet",
		"setA",
	);

	// ランキングは起動時に取得し、キャッシュを即座に表示する
	const ranking = useFetchRanking();
	const { refetch } = ranking;

	// 選択中のセットを優先して、すべての問題画像を先読みしておく
	useEffect(() => {
		const keys = Object.keys(riddleSets) as RiddleSetKey[];
		const ordered = [selectedSet, ...keys.filter((k) => k !== selectedSet)];
		ordered.reduce<Promise<unknown>>(
			(prev, key) => prev.then(() => preloadImages(riddleSets[key].images)),
			Promise.resolve(),
		);
	}, [selectedSet]);

	// 保存されていた状態が不整合ならホームに戻す
	const validGame = game && game.setKey in riddleSets ? game : null;
	const currentPage: Page = page !== "home" && !validGame ? "home" : page;

	// プレイ中・結果画面ではブラウザの戻る操作を無効にする
	const [backBlocked, setBackBlocked] = useState(false);
	useBlockBackNavigation(currentPage !== "home", () => setBackBlocked(true));

	// biome-ignore lint/correctness/useExhaustiveDependencies: 画面切り替え時にスクロール位置を戻す
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [currentPage]);

	// ranked が false のときは名前なしで遊べる（ランキングには掲載しない）
	const handleStart = (ranked: boolean) => {
		if (ranked && !userName.trim()) return;
		setUserName(userName.trim());
		setGame(createGame(selectedSet, ranked));
		setRankingSet(selectedSet);
		setPage("puzzle");
		// 終了後すぐに表示できるよう、開始時点でランキングを取得しておく
		refetch();
	};

	const handleFinish = useCallback(() => setPage("result"), [setPage]);

	const handleBackToTitle = () => {
		setGame(null);
		setPage("home");
		setHomeTab(0);
	};

	// クリアしたら結果を一度だけ送信し、ランキングを更新する
	const sendingRef = useRef(false);
	useEffect(() => {
		if (
			!validGame ||
			validGame.ranked === false ||
			validGame.finishedTime == null ||
			validGame.submitted
		)
			return;
		if (sendingRef.current) return;
		sendingRef.current = true;
		setGame((prev) => (prev ? { ...prev, submitted: true } : prev));
		sendToGAS({
			selectedSetTitle: riddleSets[validGame.setKey].title,
			userName,
			clearTime: formatTime(validGame.finishedTime),
			hintCount: validGame.hintCount,
			passCount: validGame.passCount,
		}).finally(() => {
			sendingRef.current = false;
			refetch();
		});
	}, [validGame, userName, setGame, refetch]);

	return (
		<Container
			maxWidth={false}
			sx={{
				maxWidth: currentPage === "puzzle" ? 640 : 520,
				px: { xs: 2, sm: 3 },
			}}
		>
			{currentPage === "home" && (
				<HomeScreen
					tab={homeTab}
					setTab={setHomeTab}
					selectedSet={selectedSet}
					setSelectedSet={setSelectedSet}
					rankingSet={rankingSet}
					setRankingSet={setRankingSet}
					userName={userName}
					setUserName={setUserName}
					onStart={handleStart}
					ranking={ranking}
				/>
			)}
			{currentPage === "puzzle" && validGame && (
				<PuzzleScreen
					content={riddleSets[validGame.setKey]}
					game={validGame}
					setGame={setGame}
					onFinish={handleFinish}
				/>
			)}
			{currentPage === "result" && validGame && (
				<ResultScreen
					game={validGame}
					userName={userName}
					ranking={ranking}
					rankingSet={rankingSet}
					setRankingSet={setRankingSet}
					onBackToTitle={handleBackToTitle}
				/>
			)}
			<Snackbar
				open={backBlocked}
				autoHideDuration={2500}
				onClose={() => setBackBlocked(false)}
				message={
					currentPage === "puzzle"
						? "プレイ中は戻る操作はできません"
						: "「タイトルに戻る」ボタンからホームに戻れます"
				}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			/>
		</Container>
	);
};

export default App;
