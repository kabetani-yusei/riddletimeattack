// src/App.tsx
import type React from "react";
import { useState } from "react";
import {
	Button,
	Container,
	Stack,
	Typography,
	Box,
	FormControl,
	RadioGroup,
	FormLabel,
	Radio,
	FormControlLabel,
} from "@mui/material";
import PuzzleScreen from "./PuzzleScreen";
import ResultScreen from "./ResultScreen";
import { blue } from "@mui/material/colors";
import { riddleSets } from "../utils/riddleSets";

type Page = "home" | "puzzle" | "result";
type RiddleSetKey = keyof typeof riddleSets;

const App: React.FC = () => {
	const [page, setPage] = useState<Page>("home");
	const [selectedSet, setSelectedSet] = useState<RiddleSetKey>("setA");
	const [elapsedTime, setElapsedTime] = useState(0);
	const [passCount, setPassCount] = useState(0);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundColor: blue[50],
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Container maxWidth="sm" sx={{ width: "100%", maxWidth: "400px" }}>
				<Stack spacing={1} p={4} bgcolor="white" borderRadius={2} boxShadow={1}>
					<Typography
						variant="h4"
						align="center"
						gutterBottom
						sx={{
							fontWeight: "bold",
							color: blue[700], // 例: deepPurpleの500番を利用
							// もしくはテーマのprimary色の場合は、color: 'primary.main'
						}}
					>
						Riddle Time Attack
					</Typography>
					{page === "home" && (
						<>
							<FormControl component="fieldset">
								<FormLabel component="legend">謎セットを選択</FormLabel>
								<RadioGroup
									row
									value={selectedSet}
									onChange={(e) =>
										setSelectedSet(e.target.value as RiddleSetKey)
									}
								>
									{Object.entries(riddleSets).map(([key, setContent]) => (
										<FormControlLabel
											key={key}
											value={key}
											control={<Radio />}
											label={setContent.title}
										/>
									))}
								</RadioGroup>
							</FormControl>
							<Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
								・全10問の謎を解ききるまでのタイムを競います
							</Typography>
							<Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
								・答えは全てひらがなで入力してください
							</Typography>
							<Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
								・謎がわからない場合はその謎をパスできますが
								<br />
								&nbsp;&nbsp;タイムに5分のペナルティがつきます
							</Typography>
							<Button
								variant="contained"
								onClick={() => setPage("puzzle")}
								sx={{ mt: 2 }}
							>
								スタート
							</Button>
						</>
					)}
					{page === "puzzle" && (
						<PuzzleScreen
							content={riddleSets[selectedSet]}
							setElapsedTime={setElapsedTime}
							passCount={passCount}
							setPassCount={setPassCount}
							setPage={setPage}
						/>
					)}
					{page === "result" && (
						<ResultScreen
							selectedSetTitle={riddleSets[selectedSet].title}
							elapsedTime={elapsedTime}
							passCount={passCount}
						/>
					)}
				</Stack>
			</Container>
		</Box>
	);
};

export default App;
