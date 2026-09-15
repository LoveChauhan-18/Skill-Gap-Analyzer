import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Edit3, Code, MessageSquare, AlertCircle, RefreshCw, Send, Check } from 'lucide-react'
import { SpeechTranscriber } from '../utils/speechRecognition'
import './SpeechRecorder.css'

export default function SpeechRecorder({ 
  onAnswerSubmit, 
  defaultCode = '',
  questionTitle = 'Interview Question',
  isProcessing = false 
}) {
  const [inputMode, setInputMode] = useState('speech') // 'speech' or 'text'
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [codeAnswer, setCodeAnswer] = useState(defaultCode)
  const [isEditingTranscript, setIsEditingTranscript] = useState(false)
  const [flaggedPartial, setFlaggedPartial] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const transcriberRef = useRef(null)
  const timerIntervalRef = useRef(null)

  // Timer effect
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timerIntervalRef.current)
  }, [])

  // Initialize Speech Transcriber
  useEffect(() => {
    transcriberRef.current = new SpeechTranscriber(
      (newTranscript) => {
        setTranscript(newTranscript)
      },
      (err) => console.warn('Speech err:', err)
    )

    return () => {
      if (transcriberRef.current) {
        transcriberRef.current.stop()
      }
    }
  }, [])

  const toggleRecording = () => {
    if (isRecording) {
      transcriberRef.current?.stop()
      setIsRecording(false)
    } else {
      setTranscript('')
      transcriberRef.current?.start()
      setIsRecording(true)
    }
  }

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = () => {
    const finalAnswer = inputMode === 'speech' ? transcript : codeAnswer
    if (!finalAnswer && !codeAnswer) {
      alert('Please provide a spoken or typed response before submitting.')
      return
    }
    if (isRecording) {
      transcriberRef.current?.stop()
      setIsRecording(false)
    }
    onAnswerSubmit(codeAnswer, transcript, inputMode, flaggedPartial)
  }

  return (
    <div className="speech-recorder-container card-dark">
      {/* Top Controls: Input Mode Tabs & Session Timer */}
      <div className="recorder-top-bar">
        <div className="input-mode-tabs">
          <button 
            type="button"
            className={`mode-tab ${inputMode === 'speech' ? 'active' : ''}`}
            onClick={() => setInputMode('speech')}
          >
            <Mic size={16} />
            <span>Speech Answer</span>
          </button>
          <button 
            type="button"
            className={`mode-tab ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            <Code size={16} />
            <span>Code & Text Answer</span>
          </button>
        </div>

        <div className="session-timer-badge">
          <span className="timer-dot"></span>
          <span>Time Elapsed: <strong>{formatTimer(timerSeconds)}</strong></span>
        </div>
      </div>

      {/* SPEECH INPUT MODE */}
      {inputMode === 'speech' && (
        <div className="speech-mode-wrapper">
          <div className="recording-controls-area">
            <button 
              type="button"
              className={`mic-record-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              disabled={isProcessing}
            >
              {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              <span className="mic-ripple"></span>
            </button>
            <div className="mic-status-label">
              {isRecording ? (
                <span className="recording-active-text">
                  <span className="red-pulse"></span> Recording Spoken Answer... Click to Stop
                </span>
              ) : (
                <span>Click Microphone to start speaking your answer</span>
              )}
            </div>

            {/* Audio Wave Visualizer */}
            {isRecording && (
              <div className="audio-wave-bars">
                <span className="bar bar1"></span>
                <span className="bar bar2"></span>
                <span className="bar bar3"></span>
                <span className="bar bar4"></span>
                <span className="bar bar5"></span>
                <span className="bar bar6"></span>
                <span className="bar bar7"></span>
              </div>
            )}
          </div>

          {/* Transcript Preview Box */}
          <div className="transcript-box-container">
            <div className="transcript-header">
              <div className="header-left">
                <MessageSquare size={16} />
                <span>Speech-to-Text Live Transcript</span>
              </div>
              <button 
                type="button"
                className="edit-transcript-btn"
                onClick={() => setIsEditingTranscript(!isEditingTranscript)}
              >
                <Edit3 size={14} />
                <span>{isEditingTranscript ? 'Done Editing' : 'Edit Transcript'}</span>
              </button>
            </div>

            {isEditingTranscript ? (
              <textarea 
                className="transcript-editor"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Edit your transcribed spoken answer here..."
              />
            ) : (
              <div className="transcript-display">
                {transcript ? (
                  <p>{transcript}</p>
                ) : (
                  <span className="placeholder-text">Your spoken response will be transcribed here in real time...</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEXT / CODE INPUT MODE */}
      {inputMode === 'text' && (
        <div className="text-mode-wrapper">
          <label className="input-label">Technical Explanation or Code Snippet</label>
          <textarea 
            className="code-answer-editor"
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
            placeholder="Write your explanation or algorithm implementation here..."
            rows={8}
          />
        </div>
      )}

      {/* Bottom Actions & Flagging */}
      <div className="recorder-bottom-bar">
        <label className="checkbox-partial-flag">
          <input 
            type="checkbox"
            checked={flaggedPartial}
            onChange={(e) => setFlaggedPartial(e.target.checked)}
          />
          <AlertCircle size={15} />
          <span>Flag answer as partial / incomplete for LLM feedback context</span>
        </label>

        <div className="action-buttons">
          <button 
            type="button"
            className="btn btn-primary"
            onClick={() => { setTranscript(''); setCodeAnswer(defaultCode); }}
          >
            <RefreshCw size={15} />
            <span>Reset</span>
          </button>
          
          <button 
            type="button"
            className="btn btn-accent btn-submit-answer"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <RefreshCw size={16} className="spin" />
                <span>Evaluating Answer...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit for GenAI Evaluation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
