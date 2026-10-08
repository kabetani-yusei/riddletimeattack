// src/constants/riddleSets/set2.ts
import type { RiddleSetsType } from "../types";

import image1 from "../../assets/images/setB/image1.webp";
import image2 from "../../assets/images/setB/image2.webp";
import image3 from "../../assets/images/setB/image3.webp";
import image4 from "../../assets/images/setB/image4.webp";
import image5 from "../../assets/images/setB/image5.webp";
import image6 from "../../assets/images/setB/image6.webp";
import image7 from "../../assets/images/setB/image7.webp";
import image8 from "../../assets/images/setB/image8.webp";
import image9 from "../../assets/images/setB/image9.webp";
import image10 from "../../assets/images/setB/image10.webp";

export const setB: RiddleSetsType = {
	title: "セットB",
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
		"黒ではない部分に注目するとアルファベットが見えてきます",
		"一番右は「あり」のようです",
		"2つ目の時計が表すカタカナは「ヤ」です",
		"「ろ」の下半分に注目すると？",
		"10は「十」,3.14は「π」です",
		"五十音表を思い浮かべましょう",
		"文字を「書く」文字を「〇す」",
		"10は「じゅう」と「てん」と読めます",
		"今までの答えを当てはめましょう",
		"先ほどの答えは「'ま'くあけ」でした",
	],
	answers: [
		"はじまり",
		"ありさま",
		"さやあて",
		"まじっく",
		"あさやけ",
		"さっかく",
		"かけじく",
		"じさぼけ",
		"まくあけ",
		"くりあ",
	],
};
