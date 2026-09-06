import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

export default function Chat() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(null);

  const conversations = [
    { id: '1', name: 'Ramesh Singh', avatar: '', lastMessage: 'Is the price negotiable?', time: '10:30 AM', unread: 2 },
    { id: '2', name: 'Suresh Kumar', avatar: '', lastMessage: 'I will dispatch it tomorrow.', time: 'Yesterday', unread: 0 },
  ];

  return (
    <div className="h-[calc(100vh-64px)] bg-white flex overflow-hidden">
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col ${activeId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 bg-earth-50">
          <h1 className="text-2xl font-bold text-gray-900">{t('chat.messages')}</h1>
        </div>
        <ChatList conversations={conversations} activeId={activeId} onSelect={setActiveId} />
      </div>
      <div className={`flex-1 flex flex-col bg-gray-50 ${!activeId ? 'hidden md:flex' : 'flex'}`}>
        {activeId ? (
          <ChatWindow conversationId={activeId} onBack={() => setActiveId(null)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <span className="text-4xl mb-4">💬</span>
            <p className="text-lg">{t('chat.select_conversation')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
