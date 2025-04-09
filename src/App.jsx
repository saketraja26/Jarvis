import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const ENDPOINT = "https://saket-m99hxibf-eastus2.services.ai.azure.com/models/chat/completions";

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        ENDPOINT,
        {
          model: "DeepSeek-V3",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...newMessages
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="jarvis-container">
      <header className="jarvis-header">
        <h1>J.A.R.V.I.S.</h1>
        <p className="subtitle">Just A Rather Very Intelligent System</p>
      </header>

      <div className="main-frame">
        <div className="chat-window">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.role}`}>
              <span className="sender">{msg.role === 'user' ? 'You' : 'JARVIS'}</span>
              <p>{msg.content}</p>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble assistant typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
          <div ref={bottomRef}></div>
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            placeholder="Type your command..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
