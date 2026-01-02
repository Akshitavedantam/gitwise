import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, 
});

export interface RepoAnalysisData {
  owner: string;
  name: string;
  description: string | null;
  stars: number;
  openIssues: number;
  forks: number;
  language: string | null;
  url: string;
  latestCommit: {
    message: string;
    author: string;
    date: string;
    url: string;
  } | null;
}

export async function fetchRepoDetails(owner: string, repo: string): Promise<RepoAnalysisData> {
  try {

    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });

    const latest = commits[0];

    return {
      owner: repoData.owner.login,
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      openIssues: repoData.open_issues_count,
      forks: repoData.forks_count,
      language: repoData.language,
      url: repoData.html_url,
      latestCommit: latest ? {
        message: latest.commit.message,
        author: latest.commit.author?.name || "Unknown",
        date: latest.commit.author?.date || new Date().toISOString(),
        url: latest.html_url,
      } : null,
    };
  } catch (error: any) {
    console.error("GitHub API Error:", error);
    if (error.status === 404) {
      throw new Error("Repository not found. Please check the URL and visibility.");
    }
    if (error.status === 403) {
      throw new Error("API Rate limit exceeded. Please check your GITHUB_TOKEN.");
    }
    throw new Error("Failed to fetch repository data.");
  }
}