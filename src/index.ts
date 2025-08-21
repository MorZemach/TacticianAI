import fastify from 'fastify'
import cors from '@fastify/cors';
import { chatRouter } from './routers/ai-chat.router';
import dotenv from 'dotenv';

dotenv.config();

const port = parseInt(process.env.PORT ?? '8080');

const server = fastify({ logger: true })

// Currently not in used, will be relevant for the UI soon
await server.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['POST']
});

server.register(chatRouter);

server.get('/', async (request, reply) => {
    return 'Mor ❤️ Eden, and they will have beautiful 👨‍👩‍👧‍👦🐣🤱🧑‍🍼 after their 🍯🌙 in Japan 🏯🍙🎎'
})

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen({ port }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})