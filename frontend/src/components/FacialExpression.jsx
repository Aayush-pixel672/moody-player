import { useEffect, useRef } from "react"

import * as faceapi from "face-api.js"

import * as tf from "@tensorflow/tfjs"

const FacialExpression = ({
  setMood,
  startDetection
}) => {

  // VIDEO REFERENCE

  const videoRef = useRef()

  // START CAMERA

  const startVideo = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true
        })

      videoRef.current.srcObject = stream

    } catch (error) {

      console.log(error)
    }
  }

  // LOAD MODELS

  const loadModels = async () => {

    await faceapi.nets.tinyFaceDetector.loadFromUri("/models")

    await faceapi.nets.faceExpressionNet.loadFromUri("/models")

    console.log("Models Loaded")
  }

  // DETECT MOOD

  const detectMood = () => {

    const interval = setInterval(async () => {

      if (!videoRef.current) return

      const detections =
        await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 512,
              scoreThreshold: 0.5
            })
          )
          .withFaceExpressions()

      console.log(detections)

      if (detections) {

        const expressions =
          detections.expressions

        let maxExpression = "neutral"

        let maxValue = 0

        for (const expression in expressions) {

          if (expressions[expression] > maxValue) {

            maxValue = expressions[expression]

            maxExpression = expression
          }
        }

        // CONFIDENCE CHECK

        if (maxValue > 0.6) {

          setMood(maxExpression)
        }
      }

    }, 700)

    return () => clearInterval(interval)
  }

  // START EVERYTHING ONLY WHEN BUTTON CLICKED

  useEffect(() => {

    if (!startDetection) return

    let cleanup

    const loadEverything = async () => {

      await tf.ready()

      console.log("TensorFlow Ready")

      await loadModels()

      await startVideo()

      videoRef.current.onloadedmetadata = () => {

        cleanup = detectMood()
      }
    }

    loadEverything()

    return () => {

      if (cleanup) cleanup()
    }

  }, [startDetection])

  return (

    <div className="flex flex-col items-center gap-5">

      {/* VIDEO */}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-[650px] rounded-3xl border-4 border-purple-500"
      />

    </div>
  )
}

export default FacialExpression