import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, MessageAuthor } from '../types';
import { getMindMateResponse, startChat } from '../services/geminiService';

// FIX: Add Speech Recognition API type definitions for TypeScript
// The Web Speech API is not a W3C standard and may not be in default TS DOM typings.
// These interfaces provide the necessary types for the component to compile.
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    start: () => void;
    stop: () => void;
}
  
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
    length: number;
}
  
interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}
  
interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}
  
declare global {
    interface Window {
      SpeechRecognition: new () => SpeechRecognition;
      webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

const CHAT_HISTORY_KEY = 'mindmate_chat_history';

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
    <div className="flex justify-start mb-4">
        <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-3">
            <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
            </div>
        </div>
    </div>
);

const promptSuggestions = [
    "I'm feeling anxious about something.",
    "Can we do a short breathing exercise?",
    "I had a really stressful day.",
    "I want to talk about my feelings."
];

const PromptSuggestions: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => {
    return (
        <div className="px-4 sm:px-6 mb-4 animate-fade-in">
            <p className="text-sm text-gray-500 mb-2">Or try starting with one of these:</p>
            <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => onSuggestionClick(prompt)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const MicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a8 8 0 0 0 7 7.93V24h2v-4.07A8 8 0 0 0 21 12v-2h-2z"/>
    </svg>
);

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Effect to save messages to local storage whenever they change
  useEffect(() => {
    if (isInitialized.current && messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Effect for speech recognition setup
  useEffect(() => {
    // FIX: Use defined types for SpeechRecognition to avoid compilation errors.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }
    setIsSpeechSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    // FIX: Add explicit types for event handlers
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      setInput(transcript);
    };

    // FIX: Add explicit types for event handlers
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };

    speechRecognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  // Effect for initialization (loading from storage or starting fresh)
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const loadOrCreateChat = async () => {
        try {
            const savedMessagesRaw = localStorage.getItem(CHAT_HISTORY_KEY);
            if (savedMessagesRaw) {
                const savedMessages: Message[] = JSON.parse(savedMessagesRaw);
                if (savedMessages.length > 0) {
                    setMessages(savedMessages);
                    startChat(savedMessages);
                    return;
                }
            }
        } catch (error) {
            console.error("Failed to load chat history, starting new chat.", error);
        }
        
        setIsLoading(true);
        startChat();
        const initialGreeting = await getMindMateResponse("Hello, I'm starting a new session and would like a friendly greeting.");
        setMessages([{ author: MessageAuthor.AI, text: initialGreeting }]);
        setIsLoading(false);
    };

    loadOrCreateChat();
  }, []);

  const handleSend = async (prompt?: string) => {
    const messageText = prompt || input;
    if (messageText.trim() === '' || isLoading) return;

    const userMessage: Message = { author: MessageAuthor.USER, text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    
    if (!prompt) {
        setInput('');
    }
    setIsLoading(true);

    try {
      const aiResponse = await getMindMateResponse(messageText);
      const aiMessage: Message = { author: MessageAuthor.AI, text: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        author: MessageAuthor.AI,
        text: "I'm sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  const handleVoiceClick = () => {
    if (!speechRecognitionRef.current) return;

    if (isRecording) {
      speechRecognitionRef.current.stop();
    } else {
      setInput(''); 
      speechRecognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {isLoading && messages.length === 0 && <TypingIndicator />}
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {messages.length === 1 && !isLoading && <PromptSuggestions onSuggestionClick={handleSend} />}
        {isLoading && messages.length > 0 && messages[messages.length-1]?.author === MessageAuthor.USER && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex items-center bg-gray-100 rounded-xl p-2">
          <textarea
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none p-2 text-gray-700"
            placeholder={isRecording ? "Listening..." : "Type your message here..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            disabled={isLoading || isRecording || (messages.length === 0 && !isInitialized.current)}
            style={{maxHeight: '120px'}}
          />
          {isSpeechSupported && (
            <button
                onClick={handleVoiceClick}
                disabled={isLoading || (messages.length === 0 && !isInitialized.current)}
                className={`p-3 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isRecording
                    ? 'text-red-500 animate-pulse'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                <MicIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim() || isRecording || (messages.length === 0 && !isInitialized.current)}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;