'use server';

/**
 * @fileOverview An AI-powered content moderation tool.
 *
 * - moderateContent - A function that moderates user-generated content.
 * - ModerateContentInput - The input type for the moderateContent function.
 * - ModerateContentOutput - The return type for the moderateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateContentInputSchema = z.object({
  text: z.string().describe('The text content to be moderated.'),
});
export type ModerateContentInput = z.infer<typeof ModerateContentInputSchema>;

const ModerateContentOutputSchema = z.object({
  isHateSpeech: z.boolean().describe('Whether the content contains hate speech.'),
  isSpam: z.boolean().describe('Whether the content is spam.'),
  isOffTopic: z.boolean().describe('Whether the content is off-topic.'),
  flagReason: z.string().optional().describe('The reason for flagging the content, if any.'),
});
export type ModerateContentOutput = z.infer<typeof ModerateContentOutputSchema>;

export async function moderateContent(input: ModerateContentInput): Promise<ModerateContentOutput> {
  return moderateContentFlow(input);
}

const moderateContentPrompt = ai.definePrompt({
  name: 'moderateContentPrompt',
  input: {schema: ModerateContentInputSchema},
  output: {schema: ModerateContentOutputSchema},
  prompt: `You are an AI content moderator for the UnFiltered social media platform. Your task is to analyze the given text content and determine if it violates the platform's guidelines.

Here are the guidelines:
- Hate speech: Content that promotes violence, incites hatred, or disparages individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics.
- Spam: Irrelevant, unsolicited, or commercial content that disrupts the user experience.
- Off-topic: Content that is not relevant to the discussion or the group it is posted in.

Analyze the following content:
{{{text}}}

Based on your analysis, please provide the following information in JSON format:
{
  "isHateSpeech": true or false,
  "isSpam": true or false,
  "isOffTopic": true or false,
  "flagReason": "Reason for flagging the content (if any)."
}
`,
});

const moderateContentFlow = ai.defineFlow(
  {
    name: 'moderateContentFlow',
    inputSchema: ModerateContentInputSchema,
    outputSchema: ModerateContentOutputSchema,
  },
  async input => {
    const {output} = await moderateContentPrompt(input);
    return output!;
  }
);
