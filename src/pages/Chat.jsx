import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import { getConversations } from '../services/chat';
import { useAuth } from '../contexts/AuthContext';

export default function Chat() {
  const { t } = useTranslation();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeId = conversationId || null;

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await getConversations();
      const items = (data.data || []).map((conversation) => {
        const other = conversation.participants.find((participant) => String(participant._id) !== String(user?._id));
        return {
          id: conversation._id, name: other?.name || t('chat.conversation', 'Conversation'), avatar: other?.avatar,
          lastMessage: conversation.lastMessage?.text || conversation.listing?.title || t('chat.startConversation', 'Start a conversation'),
          time: conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          unread: conversation.unreadCount?.[user?._id] || 0,
        };
      });
      setConversations(items);
    } catch (error) { toast.error(error.response?.data?.message || t('chat.loadConversationsError', 'Could not load conversations.')); }
    finally { setLoading(false); }
  }, [user, t]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  return (
    <div className="h-[calc(100vh-64px)] bg-white flex overflow-hidden">
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col ${activeId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 bg-earth-50"><h1 className="text-2xl font-bold text-gray-900">{t('chat.messages', 'Messages')}</h1></div>
        {loading ? <div className="p-6 text-gray-500">{t('chat.loadingConversations', 'Loading conversations…')}</div> : <ChatList conversations={conversations} activeId={activeId} onSelect={(id) => navigate(`/chat/${id}`)} />}
      </div>
      <div className={`flex-1 flex flex-col bg-gray-50 ${!activeId ? 'hidden md:flex' : 'flex'}`}>
        {activeId ? <ChatWindow conversationId={activeId} conversation={conversations.find((item) => item.id === activeId)} userId={user?._id} onBack={() => navigate('/chat')} onSent={loadConversations} /> : <div className="flex-1 flex flex-col items-center justify-center text-gray-400"><span className="text-4xl mb-4">💬</span><p className="text-lg">{t('chat.select_conversation', 'Select a conversation to start messaging')}</p>{!conversations.length && <p className="mt-2 text-sm">{loading ? '' : t('chat.startFromListing', 'Start a conversation from a listing page.')}</p>}</div>}
      </div>
    </div>
  );
}
