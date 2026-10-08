import { useEffect, useState } from "react";

type StorageKind = "session" | "local";

const getStorage = (kind: StorageKind): Storage | null => {
	try {
		return kind === "local" ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
};

export const readStorage = <T>(
	key: string,
	fallback: T,
	kind: StorageKind = "session",
): T => {
	try {
		const raw = getStorage(kind)?.getItem(key);
		return raw == null ? fallback : (JSON.parse(raw) as T);
	} catch {
		return fallback;
	}
};

export const writeStorage = (
	key: string,
	value: unknown,
	kind: StorageKind = "session",
) => {
	try {
		getStorage(kind)?.setItem(key, JSON.stringify(value));
	} catch {
		// ストレージが使えない環境では保存しない
	}
};

// リロードしても値が保持される useState
export default function usePersistentState<T>(
	key: string,
	initialValue: T,
	kind: StorageKind = "session",
) {
	const [value, setValue] = useState<T>(() =>
		readStorage(key, initialValue, kind),
	);

	useEffect(() => {
		writeStorage(key, value, kind);
	}, [key, value, kind]);

	return [value, setValue] as const;
}
