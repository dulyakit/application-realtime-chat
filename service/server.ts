import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Message } from './schema/message';

const app = express();
const PORT = process.env.PORT || 8080;

const database = "mongodb+srv://dulyakit:dulyakit@cluster0.vjveoy1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(database)
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
  const { text, sender } = req.body;
  if (!text || !sender) {
    return res.status(400).json({ message: 'Text and sender are required' });
  }

  const message = new Message({ text, sender });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
