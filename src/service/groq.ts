import { LsatResponse, GroqErrorResponse } from "../types/types";

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-8b-8192';

export async function generateLsatQuestion(tweetText: string): Promise<LsatResponse> {
  const { groqApiKey } = await chrome.storage.sync.get(['groqApiKey']);
  
  if (!groqApiKey) {
    throw new Error('Groq API key not found. Please add it in the popup.');
  }

  const messages = [
    {
      role: "system",
      content: `Please convert tweets into LSAT-style logical reasoning questions. Return your response in the following JSON format:
      {
        "question": {
          "stimulus": {
            "source": "tweet text here"
          },
          "questionStem": "Which one of the following is most strongly supported by the statement above, if it is true?",
          "answerChoices": [
            {
              "letter": "A",
              "text": "answer text",
              "isCorrect": true/false,
              "reasoning": "explanation why this is correct/supported by stimulus"
            }
          ]
        }
      }
      Guidelines:
      1. Stimulus must be exact tweet text
      2. Only one answer should be logically supported by stimulus alone
      3. Wrong answers should be plausible but require assumptions
      4. Use formal, precise language in answer choices
      5. Each answer must be a complete sentence`
    },
    {
      role: "user",
      content: tweetText
    }
  ];

  try {
    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json() as GroqErrorResponse;
      throw new Error(errorData.error?.message || 'Failed to generate LSAT question');
    }

    const data = await response.json();
    const lsatResponse = JSON.parse(data.choices[0].message.content) as LsatResponse;
    return lsatResponse;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate LSAT question: ${error.message}`);
    }
    throw new Error('Failed to generate LSAT question');
  }
}