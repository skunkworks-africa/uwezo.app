'use server';

/**
 * @fileOverview Automatically extracts skills from an uploaded CV using AI.
 *
 * - extractSkills - A function that handles the skill extraction process.
 * - ExtractSkillsInput - The input type for the extractSkills function.
 * - ExtractSkillsOutput - The return type for the extractSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      'A CV document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});
export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;

const ExtractSkillsOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('An array of skills extracted from the CV.'),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export async function extractSkills(input: ExtractSkillsInput): Promise<ExtractSkillsOutput> {
  return extractSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: {schema: ExtractSkillsInputSchema},
  output: {schema: ExtractSkillsOutputSchema},
  prompt: `You are a skilled AI assistant designed to extract skills from CVs.

  Please analyze the following CV and extract all relevant skills.  Return the skills as a JSON array of strings.

  CV: {{media url=cvDataUri}}`,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
