import React, { createContext, useContext, useState } from 'react'
import { MOCK_QUESTIONS, MOCK_CANDIDATE_STATS } from '../data/mockInterviewData'

const InterviewContext = createContext(null)

export const InterviewProvider = ({ children }) => {
  const [selectedDomain, setSelectedDomain] = useState('DSA')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium')
  const [activeSession, setActiveSession] = useState(null)
  const [sessionHistory, setSessionHistory] = useState(MOCK_CANDIDATE_STATS.recentSessions)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const startSession = (domain = selectedDomain, difficulty = selectedDifficulty) => {
    // Find matching question or fallback to first
    const questionsForDomain = MOCK_QUESTIONS.filter(q => q.domain === domain)
    const question = questionsForDomain.find(q => q.difficulty === difficulty) || questionsForDomain[0] || MOCK_QUESTIONS[0]

    const newSession = {
      id: `sess_${Math.floor(1000 + Math.random() * 9000)}`,
      domain,
      difficulty,
      questionId: question.id,
      questionTitle: question.title,
      prompt: question.prompt,
      starterCode: question.starterCode,
      modelAnswer: question.modelAnswer,
      expectedKeywords: question.expectedKeywords,
      sampleFeedback: question.sampleFeedback,
      status: 'IN_PROGRESS', // SCHEDULED -> IN_PROGRESS -> PROCESSING_FEEDBACK -> COMPLETED
      transcript: '',
      userAnswerText: '',
      inputMode: 'speech', // 'speech' or 'text'
      flaggedPartial: false,
      startTime: Date.now(),
      feedback: null,
    }

    setActiveSession(newSession)
    showToast(`Started ${domain} (${difficulty}) Mock Interview Session!`, 'success')
    return newSession
  }

  const submitAnswer = async (userAnswer, transcript, inputMode, flaggedPartial = false) => {
    if (!activeSession) return

    // 1. Move to PROCESSING_FEEDBACK
    setActiveSession(prev => ({
      ...prev,
      userAnswerText: userAnswer,
      transcript,
      inputMode,
      flaggedPartial,
      status: 'PROCESSING_FEEDBACK'
    }))

    showToast('GenAI evaluating answer & computing evidence-grounded feedback...', 'info')

    // 2. Simulate AI processing delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 3. Compute/retrieve feedback
    const baseFeedback = activeSession.sampleFeedback || MOCK_QUESTIONS[0].sampleFeedback

    // Slightly customize score if partial
    const finalScore = flaggedPartial ? Math.max(50, baseFeedback.score - 18) : baseFeedback.score

    const generatedFeedback = {
      ...baseFeedback,
      score: finalScore,
      evaluatedAt: new Date().toISOString(),
    }

    const completedSession = {
      ...activeSession,
      userAnswerText: userAnswer,
      transcript,
      inputMode,
      flaggedPartial,
      status: 'COMPLETED',
      feedback: generatedFeedback,
      completedAt: new Date().toISOString()
    }

    setActiveSession(completedSession)

    // Add to history
    setSessionHistory(prev => [
      {
        id: completedSession.id,
        date: new Date().toISOString().split('T')[0],
        domain: completedSession.domain,
        questionTitle: completedSession.questionTitle,
        difficulty: completedSession.difficulty,
        score: finalScore,
        status: 'COMPLETED',
        inputMode: inputMode === 'speech' ? 'Speech-to-Text' : 'Text Input'
      },
      ...prev
    ])

    showToast(`Evaluation Complete! Overall Score: ${finalScore}/100`, 'success')
  }

  const resetSession = () => {
    setActiveSession(null)
  }

  return (
    <InterviewContext.Provider
      value={{
        selectedDomain,
        setSelectedDomain,
        selectedDifficulty,
        setSelectedDifficulty,
        activeSession,
        setActiveSession,
        startSession,
        submitAnswer,
        resetSession,
        sessionHistory,
        toastMessage,
        showToast
      }}
    >
      {children}
    </InterviewContext.Provider>
  )
}

export const useInterview = () => useContext(InterviewContext)
