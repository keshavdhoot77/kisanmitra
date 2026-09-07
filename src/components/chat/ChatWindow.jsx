import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ conversationId, onBack }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi, I am interested in your organic wheat.', isMine: false, time: '10:00 AM' },
    { id: 2, text: 'Great! How much quantity do you need?', isMine: true, time: '10:05 AM' },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages([...messages, { id: Date.now(), text, isMine: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#E5DDD5]">
      <div className="h-16 px-4 bg-white border-b border-gray-200 flex items-center gap-3 shadow-sm z-10 flex-shrink-0">
        <button onClick={onBack} aria-label="Go Back" className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">R</div>
        <div><h2 className="font-bold text-gray-900">Ramesh Singh</h2><p className="text-xs text-green-600 font-medium">Online</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <button type="button" aria-label="Attach Image" title="Attach Image" className="p-3 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors"><ImageIcon className="w-6 h-6" /></button>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('chat.type_message', 'Type a message...')} className="flex-1 bg-gray-100 border-none px-4 py-3 text-base rounded-full focus:ring-2 focus:ring-primary-500 outline-none" />
          <button type="submit" disabled={!text.trim()} aria-label="Send Message" title="Send Message" className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 transition-colors"><Send className="w-5 h-5" /></button>
        </form>
      </div>
    </div>
  );
}
