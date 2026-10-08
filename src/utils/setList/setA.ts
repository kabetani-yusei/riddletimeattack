// src/constants/riddleSets/set1.ts
import type { RiddleSetsType } from "../types";

import image1 from "../../assets/images/setA/image1.webp";
import image2 from "../../assets/images/setA/image2.webp";
import image3 from "../../assets/images/setA/image3.webp";
import image4 from "../../assets/images/setA/image4.webp";
import image5 from "../../assets/images/setA/image5.webp";
import image6 from "../../assets/images/setA/image6.webp";
import image7 from "../../assets/images/setA/image7.webp";
import image8 from "../../assets/images/setA/image8.webp";
import image9 from "../../assets/images/setA/image9.webp";
import image10 from "../../assets/images/setA/image10.webp";

export const setA: RiddleSetsType = {
	title: "セットA",
	images: [
		image1,
		image2,
		image3,
		image4,
		image5,
		image6,
		image7,
		image8,
		image9,
		image10,
	],
	hints: [
		"これは「なぞ」です",
		"黒い部分に注目するとカタカナが見えてきます",
		"二文字の熟語がある状態になっています",
		"「そと」,「たけ」,「くらい」で「とけい」です",
		"下線の色で分類すると、特徴があります",
		"1には「アップ」の「プ」が入ります",
		"「いまなんもんめ」は7文字です",
		"ひらがなにして当てはめてみましょう",
		"漢字のまま当てはめてみましょう",
		"「シード」「ドール」「ガール」を当てはめてみましょう",
	],
	answers: [
		"なぞなぞ",
		"みしん",
		"さんらん",
		"かつじ",
		"らんたん",
		"ぷれい",
		"ななもんめ",
		"しゅぎょう",
		"じんしゅ",
		"しーる",
	],
};
