import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

export default function ChatList({ conversations, activeId, onSelect }) {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col">
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" placeholder={t('common.search')} className="w-full bg-gray-100 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>
      {conversations.map(conv => (
        <button key={conv.id} onClick={() => onSelect(conv.id)} className={`flex items-start gap-3 p-4 border-b border-gray-50 text-left transition-colors ${activeId === conv.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}>
          <div className="w-12 h-12 bg-primary-100 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-primary-700">{conv.name.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-gray-900 truncate">{conv.name}</h3>
              <span className="text-xs text-gray-500 flex-shrink-0">{conv.time}</span>
            </div>
            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
          </div>
          {conv.unread > 0 && <span className="bg-accent-600 text-white text-xs font-bold px-2 py-0.5 rounded-full mt-1">{conv.unread}</span>}
        </button>
      ))}
    </div>
  );
}
