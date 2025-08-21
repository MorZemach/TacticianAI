import { chatConversation } from "../controllers/ai-chat.controller";
import { FastifyInstance } from "fastify";

export async function chatRouter(server: FastifyInstance)
{
    server.post('/ai', chatConversation);
}