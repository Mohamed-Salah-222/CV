import { env } from "@/config/env";

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  location: string;
  email: string;
  blog: string;
  html_url: string;
  repos: GitHubRepo[];
}

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
}

function parseGitHubInput(input: string): { type: "user" | "repo"; owner: string; repo?: string } {
  const cleaned = input.trim().replace(/\/$/, "");
  
  if (cleaned.includes("github.com")) {
    const userMatch = cleaned.match(/github\.com[:/]([^/]+)/);
    const repoMatch = cleaned.match(/github\.com[:/]([^/]+)\/([^/]+)/);
    
    if (repoMatch) {
      return { type: "repo", owner: repoMatch[1], repo: repoMatch[2] };
    }
    if (userMatch) {
      return { type: "user", owner: userMatch[1] };
    }
  }
  
  return { type: "user", owner: cleaned };
}

export async function fetchGitHubData(urlOrUsername: string): Promise<string> {
  const parsed = parseGitHubInput(urlOrUsername);
  const username = parsed.owner;
  
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (env.GITHUB_TOKEN) {
    headers.Authorization = `token ${env.GITHUB_TOKEN}`;
  }

  let profileText = "";
  let userData: any = null;
  
  if (parsed.type === "repo" && parsed.repo) {
    const repoRes = await fetch(`https://api.github.com/repos/${username}/${parsed.repo}`, { headers });
    
    if (!repoRes.ok) {
      throw new Error(`GitHub repo not found: ${username}/${parsed.repo}`);
    }
    
    const repoData = await repoRes.json();
    
    profileText += `REPOSITORY: ${repoData.name}\n`;
    profileText += `================\n`;
    profileText += `${repoData.description || "No description"}\n`;
    profileText += `Language: ${repoData.language || "N/A"}\n`;
    profileText += `Stars: ${repoData.stargazers_count}\n`;
    profileText += `Forks: ${repoData.forks_count}\n`;
    profileText += `URL: ${repoData.html_url}\n`;
    profileText += `Owner: ${repoData.owner.login}\n`;
    
    if (repoData.homepage) {
      profileText += `Homepage: ${repoData.homepage}\n`;
    }
    
    if (repoData.topics?.length) {
      profileText += `Topics: ${repoData.topics.join(", ")}\n`;
    }
    
    const readmeRes = await fetch(`https://api.github.com/repos/${username}/${parsed.repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData.content) {
        try {
          const decoded = atob(readmeData.content);
          profileText += `\nREADME:\n`;
          profileText += `============\n`;
          profileText += decoded.substring(0, 5000) + (decoded.length > 5000 ? "\n... (truncated)" : "");
        } catch {
          // Skip if decode fails
        }
      }
    }
    
    userData = repoData.owner;
    profileText += `\n\nOWNER PROFILE:\n`;
    profileText += `==============\n`;
  }

  const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
  
  if (!userRes.ok) {
    if (parsed.type === "repo") {
      return profileText;
    }
    throw new Error(`GitHub user not found: ${username}`);
  }
  
  userData = await userRes.json();
  
  profileText = `${userData.name || userData.login}\n`;
  profileText += `${userData.bio || ""}\n`;
  profileText += `Location: ${userData.location || "N/A"}\n`;
  profileText += `GitHub: ${userData.html_url}\n`;
  
  if (userData.blog) {
    profileText += `Website: ${userData.blog}\n`;
  }
  
  profileText += `\nPUBLIC REPOSITORIES:\n`;
  profileText += `====================\n`;
  
  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=15`,
    { headers }
  );
  const repos = reposRes.ok ? await reposRes.json() : [];
  
  for (const repo of repos) {
    profileText += `\n${repo.name}\n`;
    profileText += `${repo.description || "No description"}\n`;
    profileText += `Language: ${repo.language || "N/A"}\n`;
    profileText += `Stars: ${repo.stargazers_count}\n`;
    profileText += `Link: ${repo.html_url}\n`;
  }
  
  if (userData.type === "User") {
    profileText += `\nGISTS:\n`;
    profileText += `======\n`;
    
    const gistsRes = await fetch(`https://api.github.com/users/${username}/gists`, { headers });
    const gists = gistsRes.ok ? await gistsRes.json() : [];
    
    for (const gist of gists.slice(0, 5)) {
      profileText += `\n${gist.id}\n`;
      profileText += `${gist.description || "No description"}\n`;
      profileText += `URL: ${gist.html_url}\n`;
      profileText += `Files: ${Object.keys(gist.files).join(", ")}\n`;
    }
  }

  return profileText;
}