export const MOCK_QUESTIONS = [
  // DSA Questions
  {
    id: 'q_dsa_1',
    domain: 'DSA',
    domainName: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    title: 'LRU Cache Design & Complexity Analysis',
    prompt: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for get and put operations. Explain how hash maps and doubly linked lists collaborate.',
    starterCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n\n  get(key) {\n    // Implement get operation in O(1)\n  }\n\n  put(key, value) {\n    // Implement put operation in O(1)\n  }\n}`,
    expectedKeywords: ['Doubly Linked List', 'Hash Map', 'O(1)', 'Head/Tail Dummy Nodes', 'Eviction Policy'],
    modelAnswer: 'An optimal LRU Cache uses a Hash Map combined with a Doubly Linked List. The Hash Map provides O(1) key lookups, storing keys mapped to Node pointers. The Doubly Linked List maintains access order where the Head represents the most recently used element and Tail represents the least recently used. On a get() or put() hit, the node is detached and moved to the Head. When capacity is exceeded during put(), the node before Tail is evicted from both list and map.',
    sampleFeedback: {
      score: 88,
      breakdown: {
        technicalAccuracy: 90,
        communication: 85,
        problemSolving: 92,
        codeEfficiency: 85,
      },
      strengths: [
        'Correctly identified combining Hash Map with Doubly Linked List for O(1) operations.',
        'Clear explanation of node detachment and relocation to the head node.',
        'Accurately specified time complexity O(1) and space complexity O(capacity).'
      ],
      gaps: [
        'Did not explicitly handle edge case for zero capacity or null key check.',
        'Could elaborate further on thread safety or concurrent access considerations.'
      ],
      idealKeyPoints: [
        'Hash map maps key -> node pointer',
        'Doubly linked list allows O(1) node removal and prepend',
        'Dummy head and tail nodes avoid null pointer checks'
      ],
      resources: [
        { title: 'LeetCode 146 - LRU Cache Explanation', url: 'https://leetcode.com/problems/lru-cache/' },
        { title: 'Deep Dive into Hash Table + DLL Pattern', url: 'https://geeksforgeeks.org/lru-cache-implementation/' }
      ]
    }
  },
  {
    id: 'q_dsa_2',
    domain: 'DSA',
    domainName: 'Data Structures & Algorithms',
    difficulty: 'Hard',
    title: 'Top K Frequent Elements (Heap vs QuickSelect)',
    prompt: 'Given an integer array nums and an integer k, return the k most frequent elements. Compare the Min-Heap approach with the QuickSelect algorithm in terms of time and space complexity.',
    starterCode: `function topKFrequent(nums, k) {\n  // Return top k frequent numbers\n}`,
    expectedKeywords: ['Min-Heap', 'Frequency Map', 'QuickSelect', 'O(N log K)', 'O(N) Average'],
    modelAnswer: 'First, build a frequency map of elements in O(N). Then, either maintain a Min-Heap of size K (O(N log K) time, O(N) space) or use QuickSelect partitioning based on frequency counts (average O(N) time). Min-Heap is ideal for streaming data, while QuickSelect is faster in-memory for static arrays.',
    sampleFeedback: {
      score: 84,
      breakdown: {
        technicalAccuracy: 86,
        communication: 82,
        problemSolving: 85,
        codeEfficiency: 83,
      },
      strengths: [
        'Understood frequency count building phase using a hash map.',
        'Correctly identified Min-Heap size restriction of K items.'
      ],
      gaps: [
        'Slight confusion in worst-case time complexity of QuickSelect (O(N^2) without randomized pivot).'
      ],
      idealKeyPoints: [
        'Frequency map construction: O(N)',
        'Min-Heap approach: O(N log K)',
        'QuickSelect approach: Average O(N), Worst-case O(N^2)'
      ],
      resources: [
        { title: 'Priority Queues & Heaps Guide', url: 'https://geeksforgeeks.org/heap-data-structure/' }
      ]
    }
  },

  // DBMS Questions
  {
    id: 'q_dbms_1',
    domain: 'DBMS',
    domainName: 'Database Management Systems',
    difficulty: 'Medium',
    title: 'ACID Properties & Transaction Isolation Levels',
    prompt: 'Explain the four ACID properties in DBMS. Then describe Dirty Reads, Non-Repeatable Reads, and Phantom Reads under Read Committed vs Repeatable Read isolation levels.',
    starterCode: `-- SQL Transaction Example\nBEGIN TRANSACTION;\n  UPDATE Accounts SET balance = balance - 500 WHERE id = 101;\n  UPDATE Accounts SET balance = balance + 500 WHERE id = 102;\nCOMMIT;`,
    expectedKeywords: ['Atomicity', 'Consistency', 'Isolation', 'Durability', 'Dirty Read', 'MVCC'],
    modelAnswer: 'ACID guarantees database transaction reliability. Atomicity ensures all-or-nothing execution. Consistency maintains DB invariants. Isolation prevents concurrent transaction interference. Durability guarantees committed changes persist. Read Committed prevents Dirty Reads by reading committed snapshots (MVCC). Repeatable Read prevents Non-Repeatable Reads by locking or holding consistent read snapshots for row updates throughout the transaction.',
    sampleFeedback: {
      score: 91,
      breakdown: {
        technicalAccuracy: 94,
        communication: 90,
        problemSolving: 88,
        codeEfficiency: 92,
      },
      strengths: [
        'Comprehensive breakdown of all four ACID principles with real-world banking analogy.',
        'Clear distinction between Dirty Read and Non-Repeatable Read.',
        'Mentioned Multi-Version Concurrency Control (MVCC) in PostgreSQL/MySQL.'
      ],
      gaps: [
        'Did not explain how Serializable isolation level avoids Phantom Reads using range locks or SSI.'
      ],
      idealKeyPoints: [
        'ACID definitions: Atomicity, Consistency, Isolation, Durability',
        'Dirty Read: Reading uncommitted changes of another transaction',
        'Isolation levels: Read Uncommitted < Read Committed < Repeatable Read < Serializable'
      ],
      resources: [
        { title: 'PostgreSQL Isolation Levels Documentation', url: 'https://www.postgresql.org/docs/current/transaction-iso.html' }
      ]
    }
  },
  {
    id: 'q_dbms_2',
    domain: 'DBMS',
    domainName: 'Database Management Systems',
    difficulty: 'Hard',
    title: 'B+ Tree Indexing vs Hash Indexing',
    prompt: 'Compare B+ Tree indexes and Hash indexes. When would you use a B+ Tree over a Hash index in high-throughput SQL databases?',
    starterCode: `CREATE INDEX idx_user_created ON users(created_at);\nCREATE INDEX idx_user_status ON users USING HASH(status);`,
    expectedKeywords: ['B+ Tree', 'Hash Index', 'Range Queries', 'Sequential I/O', 'O(log N)', 'O(1) Point Lookup'],
    modelAnswer: 'B+ Tree indexes store keys in balanced search trees with all data pointers at leaf nodes linked sequentially. This makes B+ Trees superior for range queries (BETWEEN, >, <, ORDER BY) with O(log N) complexity. Hash indexes use a hash table offering O(1) point lookups for equality (=) checks, but cannot support range scanning or sorted order.',
    sampleFeedback: {
      score: 86,
      breakdown: {
        technicalAccuracy: 88,
        communication: 84,
        problemSolving: 85,
        codeEfficiency: 87,
      },
      strengths: [
        'Accurately explained leaf node linking in B+ Trees for fast range scans.',
        'Correctly identified equality vs inequality query performance differences.'
      ],
      gaps: [
        'Omitted discussion on disk page I/O alignment and tree height fan-out factor.'
      ],
      idealKeyPoints: [
        'B+ Tree supports range queries and sorting (O(log N))',
        'Hash Index only supports exact equality match (O(1))',
        'B+ Trees optimize disk I/O by fitting high fan-out branches per page'
      ],
      resources: [
        { title: 'Database Indexing Architecture Guide', url: 'https://use-the-index-luke.com/' }
      ]
    }
  },

  // Full Stack Questions
  {
    id: 'q_fs_1',
    domain: 'Full Stack',
    domainName: 'Full Stack Web Development',
    difficulty: 'Medium',
    title: 'JWT Authentication vs Session-based Auth & CSRF Mitigation',
    prompt: 'Compare JWT (JSON Web Tokens) with Server-Side Sessions for user authentication. How do you store JWTs securely on the client to prevent XSS and CSRF attacks?',
    starterCode: `// Express JWT verification middleware\nfunction authenticateToken(req, res, next) {\n  const authHeader = req.headers['authorization'];\n  const token = authHeader && authHeader.split(' ')[1];\n  if (!token) return res.sendStatus(401);\n  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {\n    if (err) return res.sendStatus(403);\n    req.user = user;\n    next();\n  });\n}`,
    expectedKeywords: ['JWT', 'HttpOnly Cookie', 'Stateless', 'XSS', 'CSRF', 'SameSite=Strict', 'Refresh Token'],
    modelAnswer: 'JWTs are stateless signed tokens decoded by servers without database lookup. Server sessions store session state in a store (e.g. Redis). Storing JWTs in localStorage exposes them to XSS script theft. The secure approach is storing JWTs in HttpOnly, Secure, SameSite=Strict cookies, or keeping access tokens in memory while using HttpOnly refresh cookies.',
    sampleFeedback: {
      score: 92,
      breakdown: {
        technicalAccuracy: 95,
        communication: 90,
        problemSolving: 92,
        codeEfficiency: 91,
      },
      strengths: [
        'Strong security posture: emphasized HttpOnly and SameSite cookie flags.',
        'Clear understanding of stateless token verification vs stateful session stores.',
        'Provided complete access token + refresh token architecture flow.'
      ],
      gaps: [
        'Could detail token revocation strategies (e.g., token blacklist in Redis).'
      ],
      idealKeyPoints: [
        'Stateless (JWT) vs Stateful (Session Store)',
        'XSS risk with localStorage vs CSRF risk with cookies',
        'HttpOnly, Secure, SameSite=Strict cookie mitigation',
        'Short-lived access token + rotating refresh token pattern'
      ],
      resources: [
        { title: 'OWASP Authentication & JWT Security Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html' }
      ]
    }
  },
  {
    id: 'q_fs_2',
    domain: 'Full Stack',
    domainName: 'Full Stack Web Development',
    difficulty: 'Hard',
    title: 'Microservices Communication: REST vs gRPC vs Event Pub/Sub',
    prompt: 'You are designing a high-scale e-commerce order processing system. Compare synchronous REST API calls, gRPC HTTP/2 RPCs, and asynchronous message queues (Kafka/RabbitMQ) for service inter-communication.',
    starterCode: `// Event Producer Concept\nawait kafkaProducer.send({\n  topic: 'order-created',\n  messages: [{ key: order.id, value: JSON.stringify(order) }],
});`,
    expectedKeywords: ['gRPC', 'Protobuf', 'Kafka/RabbitMQ', 'Eventual Consistency', 'Dead Letter Queue', 'Backpressure'],
    modelAnswer: 'For internal high-performance microservice RPCs, gRPC with HTTP/2 and Protocol Buffers reduces payload size and serialization latency compared to JSON REST. For decoupling order placement from payment processing and inventory updates, asynchronous event streams (Kafka/RabbitMQ) ensure resilience, backpressure management, and eventual consistency without cascading service failures.',
    sampleFeedback: {
      score: 89,
      breakdown: {
        technicalAccuracy: 91,
        communication: 88,
        problemSolving: 90,
        codeEfficiency: 87,
      },
      strengths: [
        'Articulated trade-offs between sync (REST/gRPC) and async (Kafka/RabbitMQ).',
        'Correctly highlighted Protocol Buffers binary efficiency.'
      ],
      gaps: [
        'Did not address distributed transactions or Saga pattern for compensating actions.'
      ],
      idealKeyPoints: [
        'gRPC: HTTP/2 multiplexing + binary Protobuf serialization',
        'Event-driven Pub/Sub: Decouples producer & consumer, fault-tolerant retry',
        'Eventual consistency & Saga pattern for cross-service database updates'
      ],
      resources: [
        { title: 'Microservices Patterns & Event-Driven Architecture', url: 'https://microservices.io/patterns/data/event-driven-architecture.html' }
      ]
    }
  }
]

export const MOCK_CANDIDATE_STATS = {
  overallReadiness: 84,
  totalSessions: 14,
  hoursPracticed: 18.5,
  domainScores: {
    DSA: 82,
    DBMS: 88,
    FullStack: 86,
  },
  scoreHistory: [
    { date: '2026-08-01', dsa: 65, dbms: 70, fullstack: 68, overall: 67.6 },
    { date: '2026-08-10', dsa: 72, dbms: 75, fullstack: 74, overall: 73.6 },
    { date: '2026-08-20', dsa: 78, dbms: 81, fullstack: 80, overall: 79.6 },
    { date: '2026-09-01', dsa: 80, dbms: 85, fullstack: 84, overall: 83.0 },
    { date: '2026-09-12', dsa: 82, dbms: 88, fullstack: 86, overall: 85.3 },
  ],
  radarMetrics: [
    { metric: 'Technical Accuracy', DSA: 85, DBMS: 90, FullStack: 88 },
    { metric: 'Communication', DSA: 78, DBMS: 86, FullStack: 85 },
    { metric: 'Problem Solving', DSA: 88, DBMS: 84, FullStack: 87 },
    { metric: 'Code Efficiency', DSA: 80, DBMS: 88, FullStack: 84 },
    { metric: 'Edge Case Handling', DSA: 75, DBMS: 85, FullStack: 82 },
  ],
  recentSessions: [
    {
      id: 'sess_9821',
      date: '2026-09-14',
      domain: 'DSA',
      questionTitle: 'LRU Cache Design & Complexity Analysis',
      difficulty: 'Medium',
      score: 88,
      status: 'COMPLETED',
      inputMode: 'Speech + Code',
    },
    {
      id: 'sess_9752',
      date: '2026-09-12',
      domain: 'DBMS',
      questionTitle: 'ACID Properties & Transaction Isolation Levels',
      difficulty: 'Medium',
      score: 91,
      status: 'COMPLETED',
      inputMode: 'Speech-to-Text',
    },
    {
      id: 'sess_9641',
      date: '2026-09-08',
      domain: 'Full Stack',
      questionTitle: 'JWT Authentication vs Session-based Auth & CSRF Mitigation',
      difficulty: 'Medium',
      score: 92,
      status: 'COMPLETED',
      inputMode: 'Text & Code',
    },
    {
      id: 'sess_9510',
      date: '2026-09-04',
      domain: 'DSA',
      questionTitle: 'Top K Frequent Elements (Heap vs QuickSelect)',
      difficulty: 'Hard',
      score: 84,
      status: 'COMPLETED',
      inputMode: 'Speech-to-Text',
    },
  ]
}

export const MOCK_RECRUITER_POOL = [
  {
    id: 'cand_101',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    targetRole: 'Full Stack Engineer',
    readinessScore: 88,
    status: 'RECOMMENDED_FOR_INTERVIEW',
    sessionsRun: 14,
    domainScores: { DSA: 84, DBMS: 91, FullStack: 92 },
    lastActive: '2026-09-14',
    summaryNote: 'Strong technical accuracy in JWT security & DBMS transaction isolation. Spoke clearly and structured answers well.'
  },
  {
    id: 'cand_102',
    name: 'Priya Sharma',
    email: 'priya.sharma@techdev.org',
    targetRole: 'Backend Developer (Python/Node)',
    readinessScore: 92,
    status: 'RECOMMENDED_FOR_INTERVIEW',
    sessionsRun: 18,
    domainScores: { DSA: 90, DBMS: 95, FullStack: 91 },
    lastActive: '2026-09-15',
    summaryNote: 'Exceptional database indexing & B+ Tree depth. Highly articulate verbal candidate.'
  },
  {
    id: 'cand_103',
    name: 'David Kim',
    email: 'david.kim@cs.edu',
    targetRole: 'Software Engineer (Frontend/Full Stack)',
    readinessScore: 76,
    status: 'NEEDS_PRACTICE',
    sessionsRun: 8,
    domainScores: { DSA: 70, DBMS: 74, FullStack: 84 },
    lastActive: '2026-09-11',
    summaryNote: 'Good React proficiency, but struggled slightly on DSA Heap complexity limits.'
  },
  {
    id: 'cand_104',
    name: 'Elena Rostova',
    email: 'elena.rostova@devmail.com',
    targetRole: 'DevOps / Systems Engineer',
    readinessScore: 85,
    status: 'RECOMMENDED_FOR_INTERVIEW',
    sessionsRun: 11,
    domainScores: { DSA: 80, DBMS: 88, FullStack: 87 },
    lastActive: '2026-09-13',
    summaryNote: 'Very solid microservices event pub/sub architecture understanding.'
  },
  {
    id: 'cand_105',
    name: 'Marcus Johnson',
    email: 'marcus.j@codecademy.net',
    targetRole: 'Junior Full Stack Engineer',
    readinessScore: 68,
    status: 'NEEDS_PRACTICE',
    sessionsRun: 5,
    domainScores: { DSA: 62, DBMS: 68, FullStack: 74 },
    lastActive: '2026-09-09',
    summaryNote: 'Needs additional practice on algorithm optimization and SQL transaction safety.'
  }
]

export const MOCK_ADMIN_METRICS = {
  totalMockSessions: 1420,
  activeCandidates: 348,
  activeRecruiters: 29,
  speechToTextUsage: '78%',
  textOnlyUsage: '22%',
  avgSessionDuration: '14 mins',
  llmFeedbackGroundedness: '98.4%',
  fallbackEventsCount: 3, // Graceful degradation text-only mode events
  modelVersions: [
    { name: 'OpenAI GPT-4o / LangChain RAG', domain: 'Question Gen & Scoring', status: 'Healthy', latency: '1.2s' },
    { name: 'Whisper Speech-to-Text Transcriber', domain: 'Audio Processing', status: 'Healthy', latency: '0.4s' },
    { name: 'FastAPI Microservice (Python)', domain: 'Evaluation Service', status: 'Healthy', latency: '0.8s' }
  ]
}
