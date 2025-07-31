import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from "axios";

export default function FacialExpression({ setSongs }) {
    const videoRef = useRef();
    const [mood, setMood] = useState("Not detected yet");

    const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => console.error("Error accessing webcam: ", err));
    };

    async function detectMood() {
        try {
            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (!detections || detections.length === 0) {
                setMood("No face detected");
                return;
            }

            let mostProbable = 0;
            let expression = '';
            for (const exp of Object.keys(detections[0].expressions)) {
                if (detections[0].expressions[exp] > mostProbable) {
                    mostProbable = detections[0].expressions[exp];
                    expression = exp;
                }
            }

            setMood(expression.charAt(0).toUpperCase() + expression.slice(1));

            const response = await axios.get(`https://moodyplayer-backend.onrender.com/songs?mood=${expression}`);
            setSongs(response.data.songs);
        } catch (error) {
            console.error("Mood detection failed:", error);
            setMood("Error detecting mood");
        }
    }

    useEffect(() => {
        loadModels().then(startVideo);
    }, []);

    return (
        <div className="bg-gray-700 shadow-lg rounded-2xl p-6 w-full max-w-md flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-2 text-center">Mood Detection</h1>
            
            <p className="text-lg mb-4 text-indigo-300 font-semibold">
                Current Mood: {mood}
            </p>

            <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full rounded-xl border border-gray-600 shadow-md"
            />

            <button
                onClick={detectMood}
                className="mt-6 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 
                           text-white font-semibold rounded-xl shadow-md 
                           transition transform hover:scale-105 w-full"
            >
                Detect Mood
            </button>
        </div>
    );
}
