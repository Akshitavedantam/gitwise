'use server'

import { z } from 'zod';
import { fetchRepoDetails } from '@/lib/github';

// Validation Schema
const InputSchema = z.object({
  repoUrl: z.string().url().includes("github.com", { message: "Must be a valid GitHub URL" }),
  branch: z.string().optional(),
  scope: z.enum(['last-30-days', 'last-year', 'all-time']).optional(),
  aiSummary: z.boolean().optional(),
});

export type FormState = {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
}

export async function analyzeRepository(prevState: FormState, formData: FormData): Promise<FormState> {
  // 1. Extract Data
  const rawData = {
    repoUrl: formData.get('repoUrl'),
    branch: formData.get('branch') || 'main',
    scope: formData.get('scope'),
    aiSummary: formData.get('aiSummary') === 'on',
  };

  // 2. Validate
  const validated = InputSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      message: "Invalid input",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // 3. Parse Owner/Repo
  const parts = validated.data.repoUrl.split('github.com/');
  if (parts.length < 2) return { success: false, message: "Invalid GitHub URL format" };
  
  const [owner, repo] = parts[1].split('/').filter(Boolean);
  const cleanRepo = repo?.replace('.git', '');

  if (!owner || !cleanRepo) {
    return { success: false, message: "Could not parse owner and repository name." };
  }

  // 4. Call Service
  try {
    const data = await fetchRepoDetails(owner, cleanRepo);
    return {
      success: true,
      message: "Analysis Complete",
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Analysis failed",
    };
  }
}
