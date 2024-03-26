import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Message } from './models/message';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL || '';

mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((connectionError: mongoose.Error) => {
    console.warn('Mongoose could not connect.');
    console.error(connectionError);
  });

app.use(express.json());

app.get('/messages', async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: 'desc' });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.post('/messages', async (req: Request, res: Response) => {
  const { text, sender, receiver } = req.body;
  if (!text || !sender || !receiver) {
    return res.status(422).json({ message: 'Text and sender and receiver are required' });
  }

  const message = new Message({ text, sender, receiver });

  try {
    const newMessage = await message.save();
    
    const messages = await Message.find({ sender, receiver }).sort({ createdAt: 'desc' });

    res.status(201).json(messages);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.post('/chat', async (req: Request, res: Response) => {
  const { sender, receiver } = req.body;
  if (!sender || !receiver) {
    return res.status(422).json({ message: 'Text and sender and receiver are required' });
  }

  try {
    const messages = await Message.find({ sender, receiver }).sort({ createdAt: 'desc' });
    console.log(messages);
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
