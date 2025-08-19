import fastify from 'fastify'
import cors from '@fastify/cors';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import dotenv from 'dotenv';

dotenv.config();

const port = parseInt(process.env.PORT ?? '8080');

const server = fastify({ logger: true })
await server.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['POST']
});

const { text } = await generateText({
    model: anthropic('claude-3-haiku-20240307'),
    system: 'You are a friendly assistant!',
    prompt: 'Why is the sky blue?',
});

server.get('/', async (request, reply) => {
    return 'Mor ❤️ Eden, and they will have beautiful 👨‍👩‍👧‍👦🐣🤱🧑‍🍼 after their 🍯🌙 in Japan 🏯🍙🎎'
})

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.get('/ai', async (request, reply) => {
    return text;
})

server.listen({ port }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})