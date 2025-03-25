// src/App.tsx
import React, { useState } from 'react';
import { Container, Box, Button, Card, CardMedia } from '@mui/material';
import { riddleSets } from './utils/riddleSets';
import ImageSetSelector from './components/ImageSetSelector';
import Countdown from './components/Countdown';
import Stopwatch from './components/Stopwatch';
import InputAnswer from './components/InputAnswer';
import FinalScreen from './components/FinalScreen';

const App: React.FC = () => {
  // 状態管理
  const [selectedSet, setSelectedSet] = useState<'setA' | 'setB'>('setA');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [additionalTime, setAdditionalTime] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const currentImageSet = riddleSets[selectedSet];

  const handleStart = () => {
    setShowCountdown(true);
  };

  const onCountdownComplete = () => {
    setShowCountdown(false);
    setIsRunning(true);
  };

  const showNextImage = () => {
    const nextIndex = currentImageIndex + 1;
    if (nextIndex < currentImageSet.images.length) {
      setCurrentImageIndex(nextIndex);
    } else {
      // 全画像表示し終わったら結果画面へ
      setIsRunning(false);
      setShowFinal(true);
    }
  };

  const handleAnswerSubmit = (answer: string) => {
    const correctAnswer = currentImageSet.answers[currentImageIndex];
    if (answer === correctAnswer) {
      showNextImage();
    }
  };

  const handlePass = () => {
    // パス回数をインクリメントし、5分（300,000ミリ秒）を追加
    setPassCount((prev) => prev + 1);
    setAdditionalTime((prev) => prev + 300000);
    showNextImage();
  };

  const handleTweet = () => {
    window.open(
      'https://twitter.com/intent/tweet?text=Your%20Result%20Message',
      '_blank'
    );
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        {/* 画像セット選択（開始前のみ表示） */}
        {!isRunning && !showCountdown && !showFinal && (
          <>
            <ImageSetSelector selectedSet={selectedSet} onChange={setSelectedSet} />
            <Button variant="contained" onClick={handleStart} sx={{ mt: 2 }}>
              スタート
            </Button>
          </>
        )}
        {/* カウントダウン */}
        {showCountdown && <Countdown onComplete={onCountdownComplete} />}
        {/* ゲーム中 */}
        {isRunning && !showFinal && (
          <>
            <Stopwatch
              running={isRunning}
              additionalTime={additionalTime}
              onTimeUpdate={setElapsedTime}
            />
            <Card>
              <CardMedia
                component="img"
                image={"src/assets/images/setA/image1.png"}
              />
            </Card>
            {console.log(currentImageSet.images[currentImageIndex])}
            <Box mt={2}>
              <InputAnswer onSubmit={handleAnswerSubmit} />
              <Button variant="outlined" onClick={handlePass} sx={{ ml: 2 }}>
                {`パス (計5分追加) ${passCount}`}
              </Button>
            </Box>
          </>
        )}
        {/* 結果画面 */}
        {showFinal && (
          <FinalScreen
            imageSetName={selectedSet === 'setA' ? 'セットA' : 'セットB'}
            elapsedTime={elapsedTime}
            onTweet={handleTweet}
          />
        )}
      </Box>
    </Container>
  );
};

export default App;
