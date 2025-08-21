import { FastifyRequest, FastifyReply } from 'fastify';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const conversationHistory: { role: 'user' | 'assistant', content: string }[] = [];

export async function chatConversation(request: FastifyRequest, reply: FastifyReply)
{
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
        console.error(error);
        reply.status(500).send({ error: 'Error processing your request.' });
    }
}