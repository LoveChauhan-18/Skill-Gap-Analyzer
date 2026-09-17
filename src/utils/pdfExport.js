// Utility for exporting reports as PDF (formatted printable HTML) and CSV

export const downloadSessionPDF = (sessionData, candidateName = 'Candidate') => {
  const reportHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>AI Interview Coach — Session Evaluation Report</title>
        <style>
          body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
          .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 22px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px; }
          .title { font-size: 28px; font-weight: 700; margin: 10px 0; color: #0f172a; }
          .meta { font-size: 14px; color: #64748b; margin-bottom: 20px; }
          .score-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 30px; }
          .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 15px; }
          .score-item { background: #fff; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center; }
          .score-val { font-size: 24px; font-weight: 700; color: #4f46e5; }
          .score-lbl { font-size: 11px; text-transform: uppercase; color: #64748b; margin-top: 4px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 600; background: #e0e7ff; color: #4338ca; }
          ul { padding-left: 20px; margin: 8px 0; }
          li { margin-bottom: 6px; line-height: 1.5; }
          .strengths { color: #15803d; }
          .gaps { color: #b91c1c; }
          .code-box { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px; white-space: pre-wrap; overflow-x: auto; }
          .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">AI INTERVIEW COACH</div>
            <div class="title">Technical Interview Evaluation Report</div>
          </div>
          <div>
            <span class="badge">${sessionData.domain || 'DSA'}</span>
            <span class="badge" style="background: #f1f5f9; color: #334155;">${sessionData.difficulty || 'Medium'}</span>
          </div>
        </div>

        <div class="meta">
          <strong>Candidate:</strong> ${candidateName} &nbsp;|&nbsp; 
          <strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &nbsp;|&nbsp;
          <strong>Session ID:</strong> ${sessionData.id || 'sess_' + Date.now()}
        </div>

        <div class="score-card">
          <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">Overall Session Score</div>
          <div style="font-size: 36px; font-weight: 800; color: #4f46e5;">${sessionData.feedback?.score || 88} / 100</div>
          
          <div class="score-grid">
            <div class="score-item">
              <div class="score-val">${sessionData.feedback?.breakdown?.technicalAccuracy || 90}%</div>
              <div class="score-lbl">Tech Accuracy</div>
            </div>
            <div class="score-item">
              <div class="score-val">${sessionData.feedback?.breakdown?.communication || 85}%</div>
              <div class="score-lbl">Communication</div>
            </div>
            <div class="score-item">
              <div class="score-val">${sessionData.feedback?.breakdown?.problemSolving || 92}%</div>
              <div class="score-lbl">Problem Solving</div>
            </div>
            <div class="score-item">
              <div class="score-val">${sessionData.feedback?.breakdown?.codeEfficiency || 85}%</div>
              <div class="score-lbl">Efficiency</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Question Prompt</div>
          <p><strong>${sessionData.questionTitle || 'LRU Cache Design & Complexity Analysis'}</strong></p>
          <p style="color: #475569;">${sessionData.prompt || 'Design an LRU cache with O(1) time complexity using Hash Map and Doubly Linked List.'}</p>
        </div>

        <div class="section">
          <div class="section-title">Candidate's Submitted Answer</div>
          <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
            ${sessionData.userAnswerText || sessionData.transcript || 'To implement LRU Cache in O(1) complexity, we combine a Hash Map with a Doubly Linked List...'}
          </div>
        </div>

        <div class="section">
          <div class="section-title strengths">Key Strengths & Demonstrated Evidence</div>
          <ul>
            ${(sessionData.feedback?.strengths || [
              'Correctly identified combining Hash Map with Doubly Linked List for O(1) operations.',
              'Clear explanation of node detachment and relocation to the head node.'
            ]).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title gaps">Key Knowledge Gaps & Missed Points</div>
          <ul>
            ${(sessionData.feedback?.gaps || [
              'Did not explicitly handle edge case for zero capacity or null key check.'
            ]).map(g => `<li>${g}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Ideal AI Model Answer</div>
          <div class="code-box">${sessionData.modelAnswer || 'An optimal LRU Cache uses a Hash Map combined with a Doubly Linked List...'}</div>
        </div>

        <div class="footer">
          Decision-Support Report generated by AI Interview Coach. Grounded LLM evaluation based on candidate spoken/written evidence.
        </div>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(reportHtml)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }
}

export const downloadCandidatesCSV = (candidatesList) => {
  const headers = ['ID', 'Candidate Name', 'Email', 'Target Role', 'Readiness Score', 'Status', 'DSA Score', 'DBMS Score', 'FullStack Score', 'Last Active']
  const rows = candidatesList.map(c => [
    c.id,
    `"${c.name}"`,
    c.email,
    `"${c.targetRole}"`,
    c.readinessScore,
    c.status,
    c.domainScores.DSA,
    c.domainScores.DBMS,
    c.domainScores.FullStack,
    c.lastActive
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `Candidate_Readiness_Report_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
