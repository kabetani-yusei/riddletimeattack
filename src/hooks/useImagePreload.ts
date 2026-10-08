import { useEffect, useState } from "react";

// 一度読み込んだ画像はデコード済みの状態でメモリに保持し、切り替えを即座に行えるようにする
const cache = new Map<string, Promise<void>>();
const keep: HTMLImageElement[] = [];
const loaded = new Set<string>();

export const preloadImage = (src: string): Promise<void> => {
	const cached = cache.get(src);
	if (cached) return cached;
	const img = new Image();
	img.decoding = "async";
	img.src = src;
	keep.push(img);
	const promise = img
		.decode()
		.catch(
			() =>
				new Promise<void>((resolve) => {
					if (img.complete) resolve();
					else {
						img.onload = () => resolve();
						img.onerror = () => resolve();
					}
				}),
		)
		.then(() => {
			loaded.add(src);
		});
	cache.set(src, promise);
	return promise;
};

export const preloadImages = (srcs: string[]) =>
	Promise.all(srcs.map(preloadImage));

// 画像リストの読み込み進捗を返す
export default function useImagePreload(srcs: string[]) {
	const [count, setCount] = useState(
		() => srcs.filter((s) => loaded.has(s)).length,
	);

	useEffect(() => {
		let cancelled = false;
		setCount(srcs.filter((s) => loaded.has(s)).length);
		for (const src of srcs) {
			preloadImage(src).then(() => {
				if (!cancelled) setCount(srcs.filter((s) => loaded.has(s)).length);
			});
		}
		return () => {
			cancelled = true;
		};
	}, [srcs]);

	return { loaded: count, total: srcs.length, done: count >= srcs.length };
}
