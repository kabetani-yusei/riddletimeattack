import { createTheme } from "@mui/material/styles";

export const gradientBackground =
	"radial-gradient(circle at 15% 10%, rgba(167,139,250,0.35) 0%, transparent 40%), radial-gradient(circle at 85% 90%, rgba(56,189,248,0.25) 0%, transparent 45%), linear-gradient(160deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)";

const theme = createTheme({
	palette: {
		primary: { main: "#5b4bdb", light: "#8b7cf6", dark: "#3f2fb5" },
		secondary: { main: "#f59e0b", contrastText: "#1f1300" },
		success: { main: "#10b981" },
		error: { main: "#ef4444" },
		background: { default: "#1e1b4b", paper: "#ffffff" },
	},
	shape: { borderRadius: 14 },
	typography: {
		fontFamily: [
			'"Hiragino Sans"',
			'"Hiragino Kaku Gothic ProN"',
			'"Noto Sans JP"',
			"Meiryo",
			"Roboto",
			"sans-serif",
		].join(","),
		button: { fontWeight: 700, textTransform: "none" },
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				html: { height: "100%", backgroundColor: "#1e1b4b" },
				body: {
					minHeight: "100%",
					background: gradientBackground,
					backgroundAttachment: "fixed",
					overscrollBehaviorY: "none",
				},
				"#root": { minHeight: "100dvh" },
			},
		},
		MuiButton: {
			defaultProps: { disableElevation: true },
			styleOverrides: {
				root: { borderRadius: 999, paddingInline: 20 },
				sizeLarge: { fontSize: "1.05rem", paddingBlock: 12 },
			},
		},
		MuiPaper: {
			styleOverrides: { rounded: { borderRadius: 20 } },
		},
	},
});

export default theme;
