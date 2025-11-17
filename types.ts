
export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  author: MessageAuthor;
  text: string;
}
