import { useState, useEffect, useCallback } from 'react';
import videojs from 'video.js';

export function useVideo(videoRef, videoJSOptions) {
	const [duration, setDuration] = useState(2000);
	const [currentTime, setCurrentTime] = useState(0);
	const [clickedTime, setClickedTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [isWaiting, setIsWaiting] = useState(false);
	const [isSeeking, setIsSeeking] = useState(false);
	const [size, setSize] = useState({ height: 0, width: 0 });

	const handlePlayPauseButton = useCallback(() => {
		if (videoRef.current) {
			const player = videojs(videoRef.current);

			if (!isPlaying) player.play();
			else player.pause();

			return setIsPlaying(!isPlaying);
		}
	}, [isPlaying, videoRef]);

	const play = useCallback(() => {
		if (videoRef.current) {
			const player = videojs(videoRef.current);
			player.play();
		}
	}, [videoRef]);

	const pause = useCallback(() => {
		if (videoRef.current) {
			const player = videojs(videoRef.current);
			player.pause();
		}
	}, [videoRef]);

	const handleVolumeChange = useCallback(
		(volume) => {
			if (videoRef.current) {
				const player = videojs(videoRef.current);
				player.volume(volume);
			}
		},
		[videoRef]
	);

	useEffect(() => {
		if (videoRef.current) {
			const player = videojs(videoRef.current, videoJSOptions);
			let seeking = false;

			player.one('loadedmetadata', () => {
				setSize({
					height: player.videoHeight(),
					width: player.videoWidth(),
				});
				setDuration(player.duration());
			});

			player.one('loadeddata', () => {
				setIsReady(true);
				player.setInterval(() => {
					setCurrentTime(player.currentTime());
				}, 100);
			});

			player.on('waiting', () => {
				if (!seeking) {
					setIsWaiting(true);
				}
			});

			player.on('seeking', () => {
				seeking = true;
				setIsSeeking(true);
			});

			player.on('playing', () => {
				setIsWaiting(false);
			});

			player.on('seeked', () => {
				seeking = false;
				setIsSeeking(false);
			});
		}
	}, [videoJSOptions, videoRef]);

	useEffect(() => {
		if (videoRef.current) {
			const player = videojs(videoRef.current);
			player.currentTime(clickedTime);
		}
	}, [clickedTime, videoRef]);

	useEffect(() => {
		if (videoRef.current) {
			const player = videojs(videoRef.current);

			return () => {
				player.dispose();
			};
		}
	}, [videoRef]);

	return {
		duration,
		currentTime,
		setClickedTime,
		isPlaying,
		setIsPlaying,
		isReady,
		isSeeking,
		size,
		isWaiting,
		play,
		pause,
		handlePlayPauseButton,
		handleVolumeChange,
	};
}
