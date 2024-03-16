import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  sender: string;
  receiver: string;
}

export const MessageSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema);