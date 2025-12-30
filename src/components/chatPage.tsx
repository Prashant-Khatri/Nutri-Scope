'use client';

import { useEffect, useState } from 'react';
import {
  RiskCard,
  NutrientTable,
  SafetyBadge,
} from '@/components/dumbComponents';

/* ---------------- types ---------------- */

type UIComponent = {
  component: string;
  props: any;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  uiComponents?: UIComponent[];
};

/* ---------------- constants ---------------- */

const STORAGE_KEY = 'ai-chat-history';

const COMPONENT_MAP: Record<string, React.FC<any>> = {
  RiskCard,
  NutrientTable,
  SafetyBadge,
};

/* ---------------- component ---------------- */

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  /* -------- load from localStorage -------- */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  /* -------- persist to localStorage -------- */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  /* -------- send message -------- */

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userContext: input,
        }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        uiComponents: data.uiComponents,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '⚠️ Error talking to AI.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>AI Chat</h2>

      <div style={styles.chatBox}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            {/* Text bubble */}
            {msg.content && (
              <div
                style={{
                  ...styles.message,
                  background: msg.role === 'user' ? '#2563eb' : '#e5e7eb',
                  color: msg.role === 'user' ? '#fff' : '#000',
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </pre>
              </div>
            )}

            {/* AI UI components */}
            {msg.uiComponents && (
              <div style={styles.componentStack}>
                {msg.uiComponents.map((item, index) => {
                  const Component = COMPONENT_MAP[item.component];
                  if (!Component) return null;
                  return <Component key={index} {...item.props} />;
                })}
              </div>
            )}
          </div>
        ))}

        {loading && <div style={styles.loading}>AI is typing…</div>}
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something…"
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

/* ---------------- styles ---------------- */

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  chatBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    overflowY: 'auto',
    padding: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
  },
  componentStack: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  loading: {
    fontStyle: 'italic',
    color: '#6b7280',
  },
  inputRow: {
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #d1d5db',
  },
  button: {
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
  },
};
