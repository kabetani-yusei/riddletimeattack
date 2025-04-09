// src/App.tsx
import type React from "react";
import { useState } from "react";
import useFetchRanking from "../hooks/useFetchRanking";
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
	TextField,
	Tabs,
	Tab,
} from "@mui/material";
import PuzzleScreen from "./PuzzleScreen";
import ResultScreen from "./ResultScreen";
import { blue } from "@mui/material/colors";
import { riddleSets } from "../utils/riddleSets";
import Ranking from "../components/Ranking";

type Page = "home" | "puzzle" | "result";
type RiddleSetKey = keyof typeof riddleSets;

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 1 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const App: React.FC = () => {
	const [page, setPage] = useState<Page>("home");
	const [selectedSet, setSelectedSet] = useState<RiddleSetKey>("setA");
	const [userName, setUserName] = useState("");
	const [elapsedTime, setElapsedTime] = useState(0);
	const [hintCount, setHintCount] = useState(0);
	const [passCount, setPassCount] = useState(0);
	const [submitResult, setSubmitResult] = useState(false);
	const [outputSources, setOutputSources] = useState(0);

	// ホーム画面用の状態
	const [homeTab, setHomeTab] = useState<number>(0);
	const [rankingSet, setRankingSet] = useState<RiddleSetKey>("setA");

	// useFetchRanking フックからランキングデータ、loading、refetch を取得
	const { rankingData, loading, refetch } = useFetchRanking();

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
						variant="h5"
						align="center"
						gutterBottom
						sx={{
							fontWeight: "bold",
							color: blue[700],
						}}
					>
						Riddle Time Attack
					</Typography>
					{page === "home" && (
						<>
							<Tabs
								value={homeTab}
								onChange={(_event, newValue) => setHomeTab(newValue)}
								centered
							>
								<Tab label="ホーム" {...a11yProps(0)} />
								<Tab label="ランキング" {...a11yProps(1)} />
							</Tabs>
							<CustomTabPanel value={homeTab} index={0}>
								<Stack direction="column" spacing={2} mb={2}>
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
									<TextField
										required
										error={!userName}
										label="ランキング掲載用のユーザー名"
										value={userName}
										onChange={(e) => setUserName(e.target.value)}
										fullWidth
										size="small"
										sx={{ mt: 0 }}
									/>
									<Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
										・全10問の謎を解ききるまでのタイムを競います
									</Typography>
									<Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
										・答えは全てひらがなで入力してください
									</Typography>
									<Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
										・謎がわからない場合はヒントを見ることができます
										<br />
										&nbsp;&nbsp;ただし、タイムに1分のペナルティがつきます
									</Typography>
									<Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
										・ヒントを見ても分からない場合はパスをしてください
										<br />
										&nbsp;&nbsp;ただし、タイムに3分のペナルティがつきます
									</Typography>
									<Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
										・リロードや戻る操作は行わないでください
									</Typography>
									<Button
										variant="contained"
										onClick={() => setPage("puzzle")}
										sx={{ mt: 0 }}
										disabled={!userName}
									>
										スタート
									</Button>
								</Stack>
							</CustomTabPanel>
							<CustomTabPanel value={homeTab} index={1}>
								{/* ランキング上部に問題セット選択用のラジオボタン */}
								<Box mb={2}>
									<FormControl component="fieldset">
										<FormLabel component="legend">問題セットを選択</FormLabel>
										<RadioGroup
											row
											value={rankingSet}
											onChange={(e) =>
												setRankingSet(e.target.value as RiddleSetKey)
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
								</Box>
								<Ranking
									selectedSetTitle={riddleSets[rankingSet].title}
									rankingItem={rankingData}
									loading={loading}
									refetch={refetch}
								/>
							</CustomTabPanel>
						</>
					)}
					{page === "puzzle" && (
						<PuzzleScreen
							content={riddleSets[selectedSet]}
							setElapsedTime={setElapsedTime}
							setHintCount={setHintCount}
							passCount={passCount}
							setPassCount={setPassCount}
							setPage={setPage}
						/>
					)}
					{page === "result" && (
						<>
							<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
								<Tabs
									value={outputSources}
									onChange={(_event, newValue) => setOutputSources(newValue)}
									centered
								>
									<Tab label="結果" {...a11yProps(0)} />
									<Tab label="ランキング" {...a11yProps(1)} />
								</Tabs>
							</Box>
							<CustomTabPanel value={outputSources} index={0}>
								<CustomTabPanel value={outputSources} index={0}>
									<ResultScreen
										selectedSetTitle={riddleSets[selectedSet].title}
										elapsedTime={elapsedTime}
										userName={userName}
										hintCount={hintCount}
										passCount={passCount}
										submitResult={submitResult}
										setSubmitResult={setSubmitResult}
										refetch={refetch}
									/>
								</CustomTabPanel>
							</CustomTabPanel>
							<CustomTabPanel value={outputSources} index={1}>
								<Ranking
									selectedSetTitle={riddleSets[selectedSet].title}
									rankingItem={rankingData}
									loading={loading}
									refetch={refetch}
								/>
							</CustomTabPanel>
						</>
					)}
				</Stack>
			</Container>
		</Box>
	);
};

export default App;
