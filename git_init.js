import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const repoDir = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch\\dream-cafe-beri';

async function initAndCommit() {
  console.log('1. Initializing Git repository in:', repoDir);
  await git.init({ fs, dir: repoDir, defaultBranch: 'main' });
  console.log('   Git repository initialized successfully with defaultBranch: main');

  console.log('2. Staging project files (excluding .gitignore patterns)...');
  // Read gitignore
  const gitignoreContent = fs.readFileSync(path.join(repoDir, '.gitignore'), 'utf-8');
  console.log('   .gitignore loaded.');

  // Find all files recursively in project
  function getFiles(dir, base = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(base, entry.name).replace(/\\/g, '/');

      // Skip node_modules, dist, .git, .env, and logs
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === '.env' ||
        entry.name === '.env.local' ||
        entry.name === 'dist-ssr' ||
        entry.name.endsWith('.log')
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        files = files.concat(getFiles(fullPath, relPath));
      } else {
        files.push(relPath);
      }
    }
    return files;
  }

  const filesToAdd = getFiles(repoDir);
  console.log(`   Found ${filesToAdd.length} files to commit.`);

  for (const filepath of filesToAdd) {
    await git.add({ fs, dir: repoDir, filepath });
  }
  console.log('   All project files staged.');

  console.log('3. Creating initial commit...');
  const sha = await git.commit({
    fs,
    dir: repoDir,
    author: {
      name: 'Dream Cafe Admin',
      email: 'cafe47516@gmail.com',
    },
    message: 'Deploy Dream Cafe Beri website with 3D Experience and Admin Portal',
  });
  console.log('   Initial commit created! Commit SHA:', sha);

  // Set branch to main
  await git.branch({ fs, dir: repoDir, ref: 'main', checkout: true });
  console.log('   Active branch confirmed: main');

  console.log('\nGit repository is completely set up and ready to push to GitHub!');
}

initAndCommit().catch(console.error);
