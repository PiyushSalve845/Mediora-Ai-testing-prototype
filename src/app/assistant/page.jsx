'use client';

import { useState, useEffect, useRef } from 'react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { getChatHistory, addChatMessage, clearChat } from '@/lib/storage';

const responses = {
  food: "Most medications can be taken with food unless specified otherwise. Food helps reduce stomach upset for many medicines.",
  miss: "If you miss a dose, take it as soon as you remember. If it's close to your next dose, skip it. Never double dose.",
  side: "Common side effects include nausea, headache, dizziness, and drowsiness. Contact your doctor if effects are severe.",
  store: "Store medications at room temperature, away from light and moisture. Keep away from children.",
  interact: "Drug interactions can occur between medications and with food or supplements. Use our Interaction Checker for details.",
  hello: "Hello! I'm Mediora AI, your medication assistant. How can I help you today?",
  default: "I can help with medication questions. Ask about specific medicines, interactions, dosage, side effects, or missed doses.",
};

function getResponse(message) {
  const m = message.toLowerCase();
  if (m.includes('hello') || m.includes('hi')) return responses.hello;
  if (m.includes('food') || m.includes('eat') || m.includes('meal')) return responses.food;
  if (m.includes('miss') || m.includes('forgot') || m.includes('skip')) return responses.miss;
  if (m.includes('side') || m.includes('effect')) return responses.side;
  if (m.includes('store') || m.includes('keep') || m.includes('storage')) return responses.store;
  if (m.includes('interact')) return responses.interact;
  return responses.default;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    const history = getChatHistory();
    if (history.length === 0) {
      setMessages([{ id: 'welcome', type: 'bot', content: "Hello! I'm Mediora AI, your medication assistant. I can help with:\n\n• Medicine information\n• Drug interactions\n• Dosage guidance\n• Missed dose advice\n\nHow can I help?" }]);
    } else {
      setMessages(history);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const userMsg = { id: 'u' + Date.now(), type: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    addChatMessage(userMsg);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botMsg = { id: 'b' + Date.now(), type: 'bot', content: getResponse(text) };
      setMessages(prev => [...prev, botMsg]);
      addChatMessage(botMsg);
      setTyping(false);
    }, 1000);
  };

  const suggestions = ["Can I take medicine with food?", "What if I miss a dose?", "Common side effects?", "How to store medications?"];

  return (
    <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Mediora <span className="text-indigo-600">AI Assistant</span>
          </h1>
          <p className="text-gray-500">Your medication guide</p>
        </div>
        <Button variant="ghost" onClick={() => { clearChat(); setMessages([]); }}>🗑️ Clear</Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden" padding="p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                  msg.type === 'user' ? 'bg-indigo-100' : 'bg-indigo-600 text-white'
                }`}>
                  {msg.type === 'user' ? '👤' : '🤖'}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.type === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">🤖</div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-4 pb-4">
            <p className="text-sm text-gray-500 mb-2">💡 Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-indigo-100 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t p-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your medications..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={typing}
            />
            <Button type="submit" disabled={!input.trim() || typing}>Send</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}