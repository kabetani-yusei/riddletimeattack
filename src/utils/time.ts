const pad = (n: number) => String(n).padStart(2, "0");

const split = (ms: number) => {
	const safe = Math.max(0, ms);
	return {
		hours: Math.floor(safe / (1000 * 60 * 60)),
		minutes: Math.floor((safe / (1000 * 60)) % 60),
		seconds: Math.floor((safe / 1000) % 60),
		centiseconds: Math.floor((safe % 1000) / 10),
	};
};

// ランキング送信用の形式（例：00時間05分03秒12）。ソートのため形式は変えない
export const formatTime = (ms: number) => {
	const { hours, minutes, seconds, centiseconds } = split(ms);
	return `${pad(hours)}時間${pad(minutes)}分${pad(seconds)}秒${pad(centiseconds)}`;
};

// 先頭が「00時間」なら削除
export const formatTimeHour = (timeStr: string) =>
	timeStr.startsWith("00時間") ? timeStr.slice(4) : timeStr;

// ストップウォッチ表示用（例：05:03.12 / 1:05:03.12）
export const formatClock = (ms: number) => {
	const { hours, minutes, seconds, centiseconds } = split(ms);
	const base = `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
	return hours > 0 ? `${hours}:${base}` : base;
};
