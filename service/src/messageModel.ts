import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
  text: string
  sender: Number
  receiver: Number
}

export const MessageSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    sender: { type: Number, required: true },
    receiver: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

export const Message = mongoose.model<IMessage>('Message', MessageSchema)
