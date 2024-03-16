const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb://homestead:secret@localhost:27017/';
const { MongoClient } = require('mongodb');

// Connection URI
const dbName = 'movie_ticket';
const collectionName = 'cinema_details';

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    // Function to subscribe to messages
    const subscribeToMessages = async () => {
      while (true) {
        // Poll for new messages every second
        const messages = await db.collection(collectionName).find().toArray();

        if (messages.length > 0) {
          console.log('Received message(s):');
          console.log(messages);
          console.log('=========time=========');
          console.log(new Date());
        }

        // Wait for a second before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    // // Function to publish a message
    // const publishMessage = async (message) => {
    //   try {
    //     await db.collection(collectionName).insertOne({ message });
    //     console.log('Message published:', message);
    //   } catch (err) {
    //     console.error('Error publishing message:', err);
    //   }
    // };

    // // Example: Publish a message every 5 seconds
    // setInterval(() => {
    //   const message = `Message published at ${new Date().toLocaleTimeString()}`;
    //   publishMessage(message);
    // }, 5000);

    // Start subscribing to messages
    subscribeToMessages();

  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
