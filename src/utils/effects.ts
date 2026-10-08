export type EffectKind = "start" | "correct" | "hint" | "pass" | "clear";

export interface Effect {
	id: number;
	kind: EffectKind;
}

// 各演出の表示時間（ミリ秒）
export const EFFECT_DURATIONS: Record<EffectKind, number> = {
	start: 800,
	correct: 700,
	hint: 1100,
	pass: 1300,
	clear: 1800,
};
