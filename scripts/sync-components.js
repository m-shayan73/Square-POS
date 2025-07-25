#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Get the directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const sourceDir = path.join(rootDir, 'components', 'src', 'ui')
const targetDir = path.join(rootDir, 'apps', 'docs', 'components', 'ui')
const hashFilePath = path.join(rootDir, '.sync-components-hash')

// Import patterns to replace
const importPatterns = [
  {
    from: /from\s+['"]\.\.\/\.\.\/utils\/style-context['"]/g,
    to: "from '@pallas-ui/style-context'",
  },
  {
    from: /from\s+['"]~\/utils\/style-context['"]/g,
    to: "from '@pallas-ui/style-context'",
  },
  {
    from: /from\s+['"]\.\.\/\.\.\/utils\/types['"]/g,
    to: "from '@/components/utils/types'",
  },
  // New pattern to convert ~/ui/ paths
  {
    from: /from\s+['"]~\/ui\/([^'"]+)['"]/g,
    to: "from '@/components/ui/$1'",
  },
]

// Function to calculate hash of a directory
async function calculateDirectoryHash(directory) {
  const files = await getFilesRecursively(directory)
  const fileHashes = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, 'utf8')
      return crypto.createHash('md5').update(content).digest('hex')
    }),
  )

  return crypto.createHash('md5').update(fileHashes.join('')).digest('hex')
}

// Function to get all files in a directory recursively
async function getFilesRecursively(directory) {
  const dirents = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(directory, dirent.name)
      return dirent.isDirectory() ? getFilesRecursively(res) : res
    }),
  )
  return files.flat()
}

// Function to recursively copy directories
async function copyDir(source, target) {
  // Create target directory if it doesn't exist
  await fs.mkdir(target, { recursive: true })

  // Read source directory
  const entries = await fs.readdir(source, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const targetPath = path.join(target, entry.name)

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      await copyDir(sourcePath, targetPath)
    } else {
      // Process and copy files
      await processAndCopyFile(sourcePath, targetPath)
    }
  }
}

// Function to process and copy a file
async function processAndCopyFile(sourcePath, targetPath) {
  // Read the source file
  let content = await fs.readFile(sourcePath, 'utf8')

  // Only process TypeScript/TSX files
  if (sourcePath.endsWith('.ts') || sourcePath.endsWith('.tsx')) {
    // Replace import patterns
    for (const pattern of importPatterns) {
      content = content.replace(pattern.from, pattern.to)
    }
  }

  // Write the processed content to the target file
  await fs.writeFile(targetPath, content, 'utf8')
  console.log(`Copied and processed: ${path.relative(rootDir, targetPath)}`)
}

// Main function
async function main() {
  try {
    console.log('Checking for component changes...')

    // Calculate hash of source directory
    const currentHash = await calculateDirectoryHash(sourceDir)

    // Check if hash file exists
    let previousHash = ''
    try {
      previousHash = await fs.readFile(hashFilePath, 'utf8')
    } catch (error) {
      // File doesn't exist, that's fine
    }

    // If hashes match, no need to sync
    if (currentHash === previousHash) {
      console.log('No changes detected in components. Skipping sync.')
      return
    }

    console.log('Changes detected. Starting component sync...')

    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true })

    // Copy components
    await copyDir(sourceDir, targetDir)

    // Save new hash
    await fs.writeFile(hashFilePath, currentHash, 'utf8')

    console.log('Component sync completed successfully!')
  } catch (error) {
    console.error('Error syncing components:', error)
    process.exit(1)
  }
}

main()
