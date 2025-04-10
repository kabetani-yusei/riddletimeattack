// src/components/InputAnswer.tsx
import type React from "react";
import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

interface Props {
	onSubmit: (answer: string) => void;
}

const InputAnswer: React.FC<Props> = ({ onSubmit }) => {
	const [input, setInput] = useState("");

	const handleSubmit = () => {
		onSubmit(input.trim().toLowerCase());
		setInput("");
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			handleSubmit();
		}
	};

	return (
		<Box display="flex" alignItems="center" gap={2}>
			<TextField
				label="ひらがなで入力"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				size="small"
				sx={{
					"& .MuiInputBase-root": { height: 40 },
				}}
			/>
			<Button
				variant="contained"
				onClick={handleSubmit}
				size="small"
				sx={{ height: 40 }}
			>
				解答
			</Button>
		</Box>
	);
};

export default InputAnswer;
