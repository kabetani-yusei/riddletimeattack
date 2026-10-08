import React from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("No root element found");
}
const root = createRoot(rootElement);

root.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);
