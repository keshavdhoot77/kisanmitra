import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] px-4 py-2 relative shadow-sm ${message.isMine ? 'bg-primary-600 text-white rounded-2xl rounded-br-md' : 'bg-white text-gray-800 rounded-2xl rounded-bl-md'}`}>
        <p className="text-base leading-snug break-words pr-8">{message.text}</p>
        <div className="flex items-center gap-1 justify-end mt-1 absolute bottom-1 right-2">
          <span className={`text-[10px] ${message.isMine ? 'text-primary-200' : 'text-gray-400'}`}>{message.time}</span>
          {message.isMine && <CheckCheck className="w-3 h-3 text-primary-200" />}
        </div>
      </div>
    </div>
  );
}
