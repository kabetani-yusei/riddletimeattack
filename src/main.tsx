import React from "react";
// ここを変更：react-dom/clientからcreateRootをインポート
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import CssBaseline from "@mui/material/CssBaseline";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("No root element found");
}
const root = createRoot(rootElement);

root.render(
	<React.StrictMode>
		<CssBaseline />
		<App />
	</React.StrictMode>,
);
