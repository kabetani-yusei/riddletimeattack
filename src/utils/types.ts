// src/constants/types.ts
import type { riddleSets } from "./riddleSets";

export interface RiddleSetsType {
	title: string;
	images: string[];
	hints: string[];
	answers: string[];
}

export type Page = "home" | "puzzle" | "result";
export type RiddleSetKey = keyof typeof riddleSets;
export type QuestionResult = "correct" | "pass";

// リロードしても復元できるように、進行状況はすべてこの形で保存する
export interface GameState {
	setKey: RiddleSetKey;
	index: number;
	// カウントダウン終了時刻（エポックミリ秒）。null はカウントダウン前
	startedAt: number | null;
	penalty: number;
	hintShown: boolean;
	hintCount: number;
	passCount: number;
	results: QuestionResult[];
	finishedTime: number | null;
	submitted: boolean;
}
