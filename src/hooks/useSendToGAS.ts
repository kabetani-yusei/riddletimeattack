export const sendToGAS = async ({
	selectedSetTitle,
	userName,
	clearTime,
	hintCount,
	passCount,
}: {
	selectedSetTitle: string;
	userName: string;
	clearTime: string;
	hintCount: number;
	passCount: number;
}) => {
	const endpoint = import.meta.env.VITE_GAS_ENDPOINT;

	const now = new Date();
	const sentAt = now.toLocaleString("ja-JP", {
		timeZone: "Asia/Tokyo",
		hour12: false,
	});

	const payload = {
		sentAt,
		selectedSetTitle,
		userName,
		clearTime,
		hintCount,
		passCount,
	};

	console.log("GAS Payload:", payload);

	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "text/plain",
			},
			body: JSON.stringify(payload),
		});

		const text = await response.text();
		console.log("GAS Response:", text);
	} catch (error) {
		console.error("送信エラー:", error);
	}
};
