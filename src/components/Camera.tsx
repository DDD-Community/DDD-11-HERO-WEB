import React, { useRef, useEffect, memo } from "react"
import { useCameraPermission } from "@/hooks/useCameraPermission" // 커스텀 훅을 가져옵니다.

interface CameraProps {
  detectStart: (video: HTMLVideoElement) => void
  canvasRef: React.LegacyRef<HTMLCanvasElement> | undefined
}

/**
 * 카메라 컴포넌트
 * 사용자의 카메라를 제어하고 비디오 스트림을 화면에 표시합니다.
 */
const Camera = memo(({ detectStart, canvasRef }: CameraProps): React.ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null)

  // 커스텀 훅을 사용해 권한 상태 확인
  const { hasPermission, isPermissionDenied } = useCameraPermission()
  
  // 비디오를 시작하는 함수
  const startVideo = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          frameRate: {
            ideal: 60,
          },
          width: 1280,
          height: 720,
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // 'loadedmetadata' 이벤트가 발생하면 비디오 재생
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            detectStart(videoRef.current);
          }
        };
      }
    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }
  };

  // 비디오를 중지하는 함수
  const stopVideo = (): void => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop(); // 모든 트랙 중지
      });

      videoRef.current.srcObject = null; // 비디오 스트림 초기화
    }
  };

  // 권한 상태에 따라 비디오 시작 또는 중지
  useEffect(() => {
    if (hasPermission) {
      startVideo();
    } else if (isPermissionDenied) {
      stopVideo();
    }

    return () => {
      stopVideo(); // 컴포넌트가 언마운트될 때 비디오 중지
    };
  }, [hasPermission, isPermissionDenied]);

  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full rounded-3xl bg-[#787870]/20">
        <video
          className="absolute left-0 top-0 h-full w-full rounded-3xl object-fill"
          ref={videoRef}
          style={{ transform: "scaleX(-1)" }} // 비디오를 좌우 반전시키는 CSS 속성
        />
      </div>
      <canvas
        ref={canvasRef}
        width="1280"
        height="720"
        className="absolute left-0 top-0 h-full w-full"
        style={{ transform: "scaleX(-1)" }} // 캔버스도 좌우 반전시켜 비디오와 일치시킴
      />
    </div>
  );
});

Camera.displayName = 'Camera';

export default Camera;
