import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";

const FacialExpression = ({
  setMood,
  startDetection,
  
}) => {
  const videoRef = useRef(null);

  // Camera stream ko store karenge
  const streamRef = useRef(null);

  // Detection interval ko store karenge
  const intervalRef = useRef(null);

  // Models ko baar-baar load hone se bachayega
  const modelsLoadedRef = useRef(false);

  // -----------------------------
  // LOAD MODELS
  // -----------------------------

  const loadModels = async () => {
    if (modelsLoadedRef.current) return;

    await tf.ready();

    console.log("TensorFlow Ready");

    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");

    modelsLoadedRef.current = true;

    console.log("Models Loaded");
  };

  // -----------------------------
  // START CAMERA
  // -----------------------------

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  // -----------------------------
  // STOP CAMERA
  // -----------------------------

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    console.log("Camera stopped");
  };

  // -----------------------------
  // START MOOD DETECTION
  // -----------------------------

  const startMoodDetection = () => {
    // Agar pehle se interval chal raha hai
    // toh doosra interval create nahi karna
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      // Video ready nahi hai
      if (videoRef.current.readyState < 2) return;

      try {
        const detections = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 512,
              scoreThreshold: 0.5,
            }),
          )
          .withFaceExpressions();

        if (!detections) return;

        const expressions = detections.expressions;

        let maxExpression = "neutral";
        let maxValue = 0;

        for (const expression in expressions) {
          if (expressions[expression] > maxValue) {
            maxValue = expressions[expression];
            maxExpression = expression;
          }
        }

        // Confidence check
        if (maxValue > 0.6) {
          setMood(maxExpression);
        }
      } catch (error) {
        console.error("Mood detection error:", error);
      }
    }, 700);
  };

  // -----------------------------
  // STOP MOOD DETECTION
  // -----------------------------

  const stopMoodDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    

    console.log("Mood detection stopped");
  };

  // -----------------------------
  // MAIN EFFECT
  // -----------------------------

  useEffect(() => {
    let cancelled = false;

    const startEverything = async () => {
      try {
        await loadModels();

        if (cancelled || !startDetection) return;

        await startVideo();

        if (cancelled || !videoRef.current) return;

        if (videoRef.current.readyState >= 2) {
          startMoodDetection();
        } else {
          videoRef.current.onloadedmetadata = () => {
            if (cancelled) return;

            startMoodDetection();
          };
        }
      } catch (error) {
        console.error("Failed to start mood detection:", error);
      }
    };

    if (startDetection) {
      startEverything();
    } else {
      // startDetection false hone par
      // detection + camera dono stop
      stopMoodDetection();
      stopVideo();
    }

    return () => {
      cancelled = true;

      stopMoodDetection();
      stopVideo();

      if (videoRef.current) {
        videoRef.current.onloadedmetadata = null;
      }
    };
  }, [startDetection]);

  return (
    <div className="flex flex-col items-center gap-5">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-[650px] rounded-3xl border-4 border-purple-500"
      />
    </div>
  );
};

export default FacialExpression;
