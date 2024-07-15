import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    url("/img4.jpg");
  background-size: cover;
  background-position: center;
  color: white;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex-grow: 1;
  text-align: left;
  padding: 5%;

  @media (max-width: 768px) {
    padding: 10% 5%;
  }
`;

const PlayButton = styled.button`
  background: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  position: absolute;
  top: 24rem;
  left: 32rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    position: static;
    margin-top: 1rem;
  }

  &:hover {
    background-color: #f8f8f8;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(1px) scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const PlayIcon = styled.span`
  border-left: 20px solid black;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  margin-left: 5px;
`;

const MainSubtitle = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 6px;
  margin-left: 0.5rem;
  color: white;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const SubSubtitle = styled.p`
  font-size: 18px;
  margin-left: 0.5rem;
  margin-right: 20px;
  max-width: 500px;
  line-height: 1.4;
  text-align: left;
  color: white;

  @media (max-width: 768px) {
    font-size: 16px;
    max-width: 100%;
  }
`;

const SubtitleAndPlayWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-left: 0.4rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  text-transform: uppercase;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 1rem;
    width: 100%;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const VideoWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${(props) => (props.show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const Video = styled.video`
  max-width: 90%;
  max-height: 90%;
  position: relative;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 10px;
  font-weight: normal;
  height: 60px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 36px;
    height: auto;
  }
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  height: 15px;
  padding: 10px;
  display: flex;
  align-items: center;
`;

const VideoContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 90%;
  max-width: 1000px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 15px;
  cursor: pointer;
  margin-right: 10px;
`;

const TimeDisplay = styled.span`
  color: white;
  margin-right: 2rem;
`;

function useTypingEffect(text, typingSpeed = 150) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else {
      setIndex(0);
      setDisplayedText("");
    }
  }, [index, text, typingSpeed]);

  return displayedText;
}

function LandingPage() {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const typedText = useTypingEffect("Welcome to StyleSwipe....");

  const handlePlayButtonClick = () => {
    setShowVideo(true);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    // if (isPlaying) {
    //   videoRef.current.pause();
    // } else {
    //   videoRef.current.play();
    // }
    // setIsPlaying(!isPlaying);
    togglePlayPause();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoWrapperClick = () => {
    setShowVideo(false);
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleGetStartedClick = () => {
    navigate('/signup');
  };

  return (
    <Container>
      <MainContent>
        <Title>{typedText}</Title>
        <MainSubtitle>Play, Trend, Win!</MainSubtitle>
        <SubtitleAndPlayWrapper>
          <SubSubtitle>
            Upload your looks, discover top trends,
            <br />
            and see if you can make it to
            <br />
            the leaderboard!
          </SubSubtitle>
          <PlayButton onClick={handlePlayButtonClick}>
            <PlayIcon />
          </PlayButton>
        </SubtitleAndPlayWrapper>
        <Button type="submit" onClick={handleGetStartedClick}>
          Get Started
        </Button>
      </MainContent>
      <VideoWrapper show={showVideo} onClick={handleVideoWrapperClick}>
        <VideoContainer>
          <Video
            ref={videoRef}
            onClick={handleVideoClick}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src="/StyleSwipe.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </Video>
          <VideoControls onClick={(e) => e.stopPropagation()}>
            <ControlButton onClick={togglePlayPause}>
              {isPlaying ? "⏸" : "▶"}
            </ControlButton>
            <TimeDisplay>
              {formatTime(currentTime)} / {formatTime(duration)}
            </TimeDisplay>
          </VideoControls>
        </VideoContainer>
      </VideoWrapper>
    </Container>
  );
}

export default LandingPage;
