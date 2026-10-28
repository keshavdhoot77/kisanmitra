import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { getMessages, sendMessage } from '../../services/chat';
import toast from 'react-hot-toast';
import { useSocket } from '../../contexts/SocketContext';

export default function ChatWindow({ conversationId, conversation, userId, onBack, onSent }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'mr' ? 'mr-IN' : 'en-IN';
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMessages(conversationId)
      .then(({ data }) => { if (!cancelled) setMessages((data.data.messages || []).map((message) => ({ ...message, id: message._id, isMine: String(message.sender?._id || message.sender) === String(userId), time: new Date(message.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) }))); })
      .catch(() => { if (!cancelled) toast.error(t('chat.load_error', 'Could not load messages.')); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [conversationId, userId, locale, t]);

  useEffect(() => {
    if (!socket) return undefined;
    const receiveMessage = (payload) => {
      if (String(payload.conversationId) !== String(conversationId)) return;
      const message = payload.message;
      setMessages((current) => current.some((item) => item.id === message._id) ? current : [...current, {
        ...message, id: message._id, isMine: String(message.sender?._id || message.sender) === String(userId),
        time: new Date(message.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
      }]);
      onSent?.();
    };
    socket.on('new_message', receiveMessage);
    return () => socket.off('new_message', receiveMessage);
  }, [socket, conversationId, userId, onSent, locale]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const sent = text.trim();
      const { data } = await sendMessage({ conversationId, text: sent });
      const message = data.data;
      setMessages((current) => [...current, { ...message, id: message._id, isMine: true, time: new Date(message.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) }]);
      setText('');
      onSent?.();
    } catch { toast.error(t('chat.send_error', 'Could not send message.')); }
  };

  return (
    <div className="flex flex-col h-full bg-[#E5DDD5]">
      <div className="h-16 px-4 bg-white border-b border-gray-200 flex items-center gap-3 shadow-sm z-10 flex-shrink-0">
        <button onClick={onBack} aria-label={t('common.back', 'Back')} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">💬</div>
        <div><h2 className="font-bold text-gray-900">{conversation?.name || t('chat.conversations', 'Conversation')}</h2><p className="text-xs text-gray-500 font-medium">{conversation?.lastMessage || conversationId}</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? <p className="text-center text-gray-500">{t('chat.loading_messages', 'Loading messages…')}</p> : messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <button type="button" aria-label={t('chat.attach_image', 'Attach Image')} title={t('chat.attach_image', 'Attach Image')} className="p-3 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors"><ImageIcon className="w-6 h-6" /></button>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('chat.type_message', 'Type a message...')} className="flex-1 bg-gray-100 border-none px-4 py-3 text-base rounded-full focus:ring-2 focus:ring-primary-500 outline-none" />
          <button type="submit" disabled={!text.trim()} aria-label={t('chat.send_message', 'Send Message')} title={t('chat.send_message', 'Send Message')} className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 transition-colors"><Send className="w-5 h-5" /></button>
        </form>
      </div>
    </div>
  );
}
