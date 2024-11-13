import { PromptResponse } from '@mui/x-data-grid-premium';
import { mockPrompts } from '../constants/prompts';

export const mockPromptResolver = (_: string, query: string) => {
  const resolved = mockPrompts.get(query);

  return new Promise<PromptResponse>((resolve, reject) => {
    setTimeout(() => {
      if (resolved) {
        resolve(resolved);
      } else {
        reject(new Error('Unknown query'));
      }
    }, 1000);
  });
};
