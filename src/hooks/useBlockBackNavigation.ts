import { useEffect, useRef } from "react";

const GUARD_KEY = "rtaGuard";

const isGuardState = () =>
	typeof window.history.state === "object" &&
	window.history.state !== null &&
	GUARD_KEY in window.history.state;

// active の間、ブラウザの戻る操作（スワイプバック含む）を無効にする
export default function useBlockBackNavigation(
	active: boolean,
	onBlocked?: () => void,
) {
	const onBlockedRef = useRef(onBlocked);
	onBlockedRef.current = onBlocked;

	useEffect(() => {
		if (!active) {
			// ガード用に積んだ履歴が残っていれば取り除く（同じページ内の移動なので画面は変わらない）
			if (isGuardState()) window.history.back();
			return;
		}
		// 現在の履歴の上にガード用の履歴を積んでおき、戻られたら積み直す
		// （リロード後も history.state は残るので二重に積まない）
		if (!isGuardState()) {
			window.history.pushState({ [GUARD_KEY]: true }, "");
		}
		const handlePopState = () => {
			window.history.pushState({ [GUARD_KEY]: true }, "");
			onBlockedRef.current?.();
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [active]);
}
