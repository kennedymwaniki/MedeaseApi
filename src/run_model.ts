/* eslint-disable @typescript-eslint/only-throw-error */
import ModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const endpoint =
  process.env.AZURE_ENDPOINT! ||
  'https://kennedy-foundry-resource.services.ai.azure.com/models';
const modelName = 'DeepSeek-V3-0324';

const API_KEY = process.env.AZURE_INFERENCE_SDK_KEY!;
export async function main() {
  const client = ModelClient(
    'https://kennedy-foundry-resource.services.ai.azure.com/models',
    new AzureKeyCredential(API_KEY),
  );

  const response = await client.path('/chat/completions').post({
    body: {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'I am going to Paris, what should I see?' },
      ],
      max_tokens: 2048,
      temperature: 0.8,
      top_p: 0.1,
      presence_penalty: 0,
      frequency_penalty: 0,
      model: modelName,
    },
  });

  if (response.status !== '200') {
    if ('error' in response.body) {
      throw response.body.error;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
  if ('choices' in response.body) {
    console.log(response.body.choices[0].message.content);
  } else {
    console.error('Unexpected response body:', response.body);
  }
}
// changes made to API_KEY  changed from process.env.AZURE_INFERENCE_SDK_KEY to process.env.AZURE_INFERENCE_SDK_KEY!
main().catch((err) => {
  console.error('The sample encountered an error:', err);
});
