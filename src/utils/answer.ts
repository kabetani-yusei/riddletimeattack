// カタカナ・全角英数・空白の揺れを吸収してから判定する
export const normalizeAnswer = (value: string) =>
	value
		.normalize("NFKC")
		.replace(/\s+/g, "")
		.toLowerCase()
		.replace(/[\u30a1-\u30f6]/g, (ch) =>
			String.fromCharCode(ch.charCodeAt(0) - 0x60),
		);
