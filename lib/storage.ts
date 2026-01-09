// Local storage utilities for saving and loading projects

export interface SavedProject {
  id: string;
  title: string;
  prompt: string;
  code: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
}

const STORAGE_KEY = 'vibes_projects';

// Generate a unique ID
function generateId(): string {
  return `project_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Generate a title from the prompt
function generateTitle(prompt: string): string {
  // Take first 30 chars of prompt, clean it up
  const cleaned = prompt.trim().replace(/[^\w\s]/g, '').substring(0, 30);
  return cleaned || 'My Creation';
}

// Get all saved projects
export function getProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const projects = JSON.parse(stored) as SavedProject[];
    // Sort by most recently updated
    return projects.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

// Get a single project by ID
export function getProject(id: string): SavedProject | null {
  const projects = getProjects();
  return projects.find(p => p.id === id) || null;
}

// Save a new project or update existing
export function saveProject(
  prompt: string,
  code: string,
  existingId?: string
): SavedProject {
  const projects = getProjects();
  const now = Date.now();

  if (existingId) {
    // Update existing project
    const index = projects.findIndex(p => p.id === existingId);
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        code,
        prompt,
        updatedAt: now,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return projects[index];
    }
  }

  // Create new project
  const newProject: SavedProject = {
    id: generateId(),
    title: generateTitle(prompt),
    prompt,
    code,
    createdAt: now,
    updatedAt: now,
  };

  projects.unshift(newProject);

  // Keep only last 50 projects to avoid storage limits
  const trimmed = projects.slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

  return newProject;
}

// Update just the title of a project
export function updateProjectTitle(id: string, title: string): boolean {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) return false;

  projects[index].title = title;
  projects[index].updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  return true;
}

// Delete a project
export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);

  if (filtered.length === projects.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Clear all projects
export function clearAllProjects(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Export a project as a standalone HTML file
export function exportAsHtml(project: SavedProject): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title} - Made with VIBES</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
    canvas { border-radius: 12px; }
    .credit {
      position: fixed;
      bottom: 10px;
      right: 10px;
      color: rgba(255,255,255,0.5);
      font-family: sans-serif;
      font-size: 12px;
    }
    .credit a { color: rgba(255,255,255,0.7); }
  </style>
</head>
<body>
  <script>
// Canvas dimensions
window.__canvasWidth = 400;
window.__canvasHeight = 400;

${project.code}
  </script>
  <div class="credit">Made with <a href="https://vibes-roan.vercel.app" target="_blank">VIBES</a></div>
</body>
</html>`;
}

// Download a project as HTML file
export function downloadProject(project: SavedProject): void {
  const html = exportAsHtml(project);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.title.replace(/[^a-z0-9]/gi, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
