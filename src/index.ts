import fastify from 'fastify'
import cors from '@fastify/cors';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import dotenv from 'dotenv';

dotenv.config();

const port = parseInt(process.env.PORT ?? '8080');

const server = fastify({ logger: true })
// Currently not in used, will be relevant for the UI soon
await server.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['POST']
});

const { text } = await generateText({
    model: anthropic('claude-3-haiku-20240307'),
    system: 'You are a friendly assistant!',
    prompt: 'What do you think of computer science studies?',
});

server.get('/', async (request, reply) => {
    return 'Mor ❤️ Eden, and they will have beautiful 👨‍👩‍👧‍👦🐣🤱🧑‍🍼 after their 🍯🌙 in Japan 🏯🍙🎎'
})

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})


const conversationHistory: { role: 'user' | 'assistant', content: string }[] = [];
server.post('/ai', async (request, reply) => {
  try {
      // fastify automatically parses the JSON body into request.body
      const { userMessage } = request.body as { userMessage: string };

      if (!userMessage) {
          return reply.status(400).send({ error: 'User message is required.' });
      }

      // add the user's message to the history
      conversationHistory.push({ role: 'user', content: userMessage });

      // call the AI model with the entire conversation history
      const { text } = await generateText({
          model: anthropic('claude-3-haiku-20240307'),
          system: 'You are a friendly football analyst assistant. Respond to the user\'s message.',
          messages: conversationHistory,
      });

      // add the model's response to the history
      conversationHistory.push({ role: 'assistant', content: text });

      // send the full conversation history back to the user
      reply.send({ conversationHistory });

  } catch (error) {
      server.log.error(error);
      reply.status(500).send({ error: 'Error processing your request.' });
  }
});

server.listen({ port }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})