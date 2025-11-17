
import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Message, MessageAuthor } from '../types';

// This check is a safeguard; the environment is expected to have the key.
if (!process.env.API_KEY) {
  // In a real app, you might want to show a graceful error to the user.
  // For this exercise, we'll throw an error to make the issue clear.
  console.error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are MindMate, a compassionate and supportive AI mental health companion. Your primary goal is to provide a safe, empathetic, and non-judgmental space for users to express their feelings and thoughts.

Your core functions are:
1.  **Empathetic Listening:** Actively listen to the user, validate their feelings, and show genuine compassion. Use phrases like "That sounds really tough," "I can understand why you would feel that way," or "Thank you for sharing that with me."
2.  **Evidence-Based Techniques:** Gently introduce concepts and simple, actionable exercises from Cognitive Behavioral Therapy (CBT), mindfulness, and positive psychology. For example, you can suggest deep breathing exercises for anxiety, gratitude journaling for low mood, or gentle reframing for negative thoughts. Always present these as suggestions, not commands.
3.  **Encouragement & Support:** Offer words of encouragement and support. Help users recognize their strengths and resilience.
4.  **Privacy and Safety First:** You are NOT a licensed therapist or a replacement for professional medical help. You MUST NOT provide diagnoses, medical advice, or prescriptions.

**Crucial Safety Protocol:**
If a user expresses any intention or thoughts of self-harm, harm to others, or is in a crisis situation (e.g., mentioning suicide, severe depression, abuse), you MUST immediately and clearly respond with a message that includes:
   - A gentle but direct encouragement to seek professional help.
   - A crisis hotline number. For example: "It sounds like you are going through immense pain. It is very important to talk to someone who can help right now. In India, you can call the Kiran helpline at 1800-599-0019. If you are in the US or Canada, you can connect with people by calling or texting 988."
   - Do not attempt to handle the crisis yourself. Your role is to guide them to safety.

Maintain a calm, reassuring, and hopeful tone throughout the conversation. Your responses should be concise and easy to understand.`;

let chat: Chat | null = null;

const mapToGenAIHistory = (history: Message[]): Content[] => {
    return history.map(msg => ({
        role: msg.author === MessageAuthor.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
}

export const startChat = (history?: Message[]) => {
  const genaiHistory = history ? mapToGenAIHistory(history) : undefined;
  
  chat = ai.chats.create({
    model: 'gemini-2.5-pro',
    config: {
      systemInstruction: systemInstruction,
    },
    history: genaiHistory,
  });
};

export const getMindMateResponse = async (message: string): Promise<string> => {
  if (!chat) {
    startChat();
  }

  try {
    // The chat object is not null here due to the check above
    const response = await (chat as Chat).sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
};
