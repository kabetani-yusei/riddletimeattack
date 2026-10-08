export type EffectKind = "correct" | "hint" | "pass" | "clear";

export interface Effect {
	id: number;
	kind: EffectKind;
}

// 各演出の表示時間（ミリ秒）。プレイ中の演出は問題を隠さないよう短く控えめにする
export const EFFECT_DURATIONS: Record<EffectKind, number> = {
	correct: 450,
	hint: 1200,
	pass: 1200,
	clear: 1200,
};
