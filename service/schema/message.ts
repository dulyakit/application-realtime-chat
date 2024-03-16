import mongoose, { Document } from 'mongoose';
import { MessageSchema } from './models/message';

export interface IMessage extends Document {
  text: string;
  sender: string;
  receiver: string;
}

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
