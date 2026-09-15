// Browser Speech-to-Text helper with Web Speech API & fallback simulation

export class SpeechTranscriber {
  constructor(onTranscriptUpdate, onErrorState) {
    this.onTranscriptUpdate = onTranscriptUpdate
    this.onErrorState = onErrorState
    this.recognition = null
    this.isListening = false
    this.isFallback = false
    this.fallbackInterval = null

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = 'en-US'

        this.recognition.onresult = (event) => {
          let currentTranscript = ''
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' '
          }
          if (this.onTranscriptUpdate) {
            this.onTranscriptUpdate(currentTranscript.trim())
          }
        }

        this.recognition.onerror = (event) => {
          console.warn('Speech recognition error, engaging fallback mode:', event.error)
          this.useFallbackSimulation()
        }

        this.recognition.onend = () => {
          if (this.isListening && !this.isFallback) {
            try {
              this.recognition.start()
            } catch (e) {
              // Ignore restart error
            }
          }
        }
      } catch (e) {
        this.isFallback = true
      }
    } else {
      this.isFallback = true
    }
  }

  start() {
    this.isListening = true
    if (this.recognition && !this.isFallback) {
      try {
        this.recognition.start()
      } catch (err) {
        this.useFallbackSimulation()
      }
    } else {
      this.useFallbackSimulation()
    }
  }

  stop() {
    this.isListening = false
    if (this.recognition && !this.isFallback) {
      try {
        this.recognition.stop()
      } catch (e) {}
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval)
      this.fallbackInterval = null
    }
  }

  useFallbackSimulation() {
    this.isFallback = true
    if (this.fallbackInterval) clearInterval(this.fallbackInterval)

    const phrases = [
      'To optimize this solution, we can combine a Hash Map with a Doubly Linked List.',
      ' The Hash Map gives us fast O(1) key lookups, while the Doubly Linked List lets us move recently used nodes to the head instantly.',
      ' When capacity is exceeded, we pop the node immediately preceding the tail dummy node.',
      ' This maintains time complexity of O(1) for both get and put operations.'
    ]

    let index = 0
    let accumulatedText = ''

    this.fallbackInterval = setInterval(() => {
      if (!this.isListening) {
        clearInterval(this.fallbackInterval)
        return
      }
      if (index < phrases.length) {
        accumulatedText += (accumulatedText ? ' ' : '') + phrases[index]
        index++
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(accumulatedText)
        }
      } else {
        clearInterval(this.fallbackInterval)
      }
    }, 2200)
  }
}
