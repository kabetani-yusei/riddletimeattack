// src/components/InputAnswer.tsx
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { normalizeAnswer } from "../utils/answer";

interface Props {
	// 正解なら true を返す
	onSubmit: (answer: string) => boolean;
}

const shakeFrames: Keyframe[] = [
	{ transform: "translateX(0)" },
	{ transform: "translateX(-8px)" },
	{ transform: "translateX(8px)" },
	{ transform: "translateX(-8px)" },
	{ transform: "translateX(8px)" },
	{ transform: "translateX(0)" },
];

const InputAnswer: React.FC<Props> = ({ onSubmit }) => {
	const [input, setInput] = useState("");
	const [wrongCount, setWrongCount] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// PC ではすぐに入力できるようにフォーカスする（スマホはキーボードが画面を覆うのでしない）
		if (window.matchMedia?.("(pointer: fine)").matches) {
			inputRef.current?.focus();
		}
	}, []);

	const handleSubmit = () => {
		const answer = normalizeAnswer(input);
		if (!answer) return;
		if (onSubmit(answer)) {
			setInput("");
			setWrongCount(0);
		} else {
			setWrongCount((prev) => prev + 1);
			boxRef.current?.animate?.(shakeFrames, { duration: 400 });
			inputRef.current?.select();
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key !== "Enter") return;
		// IME の変換確定の Enter では送信しない
		if (event.nativeEvent.isComposing || event.keyCode === 229) return;
		event.preventDefault();
		handleSubmit();
	};

	const isWrong = wrongCount > 0;

	return (
		<Box
			ref={boxRef}
			display="flex"
			alignItems="flex-start"
			gap={1}
			sx={{ width: "100%" }}
		>
			<TextField
				inputRef={inputRef}
				placeholder="ひらがなで入力"
				value={input}
				onChange={(e) => {
					setInput(e.target.value);
					if (isWrong) setWrongCount(0);
				}}
				onKeyDown={handleKeyDown}
				error={isWrong}
				helperText={isWrong ? "不正解です。もう一度考えてみよう" : undefined}
				autoComplete="off"
				fullWidth
				slotProps={{
					htmlInput: {
						enterKeyHint: "done",
						autoCapitalize: "off",
						autoCorrect: "off",
						spellCheck: false,
						"aria-label": "答え",
					},
					formHelperText: {
						sx: {
							mx: 0,
							mt: 0.5,
							px: 1.5,
							fontWeight: 700,
							color: "#fecaca !important",
						},
					},
				}}
				sx={{
					"& .MuiInputBase-root": {
						bgcolor: "white",
						borderRadius: 999,
						fontSize: "1.1rem",
						height: 52,
					},
					"& .MuiOutlinedInput-input": { px: 2.5 },
				}}
			/>
			<Button
				variant="contained"
				color="secondary"
				onClick={handleSubmit}
				disabled={!input.trim()}
				sx={{
					height: 52,
					minWidth: 88,
					fontSize: "1.05rem",
					"&.Mui-disabled": {
						bgcolor: "rgba(255,255,255,0.25)",
						color: "rgba(255,255,255,0.7)",
					},
				}}
			>
				解答
			</Button>
		</Box>
	);
};

export default InputAnswer;
