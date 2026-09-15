import React from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useInterview } from '../context/InterviewContext'
import './Toast.css'

export default function Toast() {
  const { toastMessage } = useInterview()

  if (!toastMessage) return null

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success': return <CheckCircle className="toast-icon success" size={18} />
      case 'error': return <AlertCircle className="toast-icon error" size={18} />
      default: return <Info className="toast-icon info" size={18} />
    }
  }

  return (
    <div className={`toast-container anim-fade-up toast-${toastMessage.type}`}>
      {getIcon()}
      <span className="toast-text">{toastMessage.message}</span>
    </div>
  )
}
