'use server';

/**
 * @fileOverview AI assistant to answer common onboarding questions.
 *
 * - answerQuestion - A function that answers user questions about onboarding.
 * - AiAssistantInput - The input type for the answerQuestion function.
 * - AiAssistantOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistantInputSchema = z.object({
  question: z.string().describe('The onboarding question asked by the user.'),
});
export type AiAssistantInput = z.infer<typeof AiAssistantInputSchema>;

const AiAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the onboarding question.'),
});
export type AiAssistantOutput = z.infer<typeof AiAssistantOutputSchema>;

export async function answerQuestion(input: AiAssistantInput): Promise<AiAssistantOutput> {
  return answerQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistantPrompt',
  input: {schema: AiAssistantInputSchema},
  output: {schema: AiAssistantOutputSchema},
  prompt: `You are an AI assistant specialized in answering common onboarding questions for new employees.

  Answer the following question:
  {{question}}
  `,
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AiAssistantInputSchema,
    outputSchema: AiAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
