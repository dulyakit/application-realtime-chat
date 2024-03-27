import { Request, Response, NextFunction } from 'express';
import { Message } from './messageModel';

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const messages = await Message.find().sort({ createdAt: 'desc' });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function createMessage(req: Request, res: Response, next: NextFunction) {
  const { text, sender, receiver } = req.body;
  if (!text || !sender || !receiver) {
    return res.status(422).json({ message: 'Text, sender, and receiver are required' });
  }

  try {
    const message = new Message({ text, sender, receiver });
    await message.save();
    
    const messages = await Message.find({ $or:[ { sender, receiver }, {sender: receiver, receiver: sender } ]}).sort({ createdAt: 'desc' });

    res.status(201).json(messages);
  } catch (error) {
    next(error);
  }
}

export async function getChat(req: Request, res: Response, next: NextFunction) {
  const { sender, receiver } = req.body;
  if (!sender || !receiver) {
    return res.status(422).json({ message: 'Sender and receiver are required' });
  }

  try {
    const messages = await Message.find({ $or:[ { sender, receiver }, {sender: receiver, receiver: sender } ]}).sort({ createdAt: 'desc' });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}
