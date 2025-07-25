#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { globby } from 'globby'

// Get the directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const targetDir = path.join(rootDir, 'apps', 'docs', 'components', 'ui')

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
  {
    from: /from\s+['"]~\/utils\/types['"]/g,
    to: "from '@/components/utils/types'",
  },
  // New pattern to convert ~/ui/ paths
  {
    from: /from\s+['"]~\/ui\/([^'"]+)['"]/g,
    to: "from '@/components/ui/$1'",
  },
]

// Main function
async function main() {
  try {
    console.log('Processing import statements...')

    // Find all TypeScript/TSX files in the target directory
    const files = await globby([`${targetDir}/**/*.{ts,tsx}`])

    // Process each file
    for (const file of files) {
      // Read the file content
      let content = await fs.readFile(file, 'utf8')
      let modified = false

      // Replace import patterns
      for (const pattern of importPatterns) {
        const newContent = content.replace(pattern.from, pattern.to)
        if (newContent !== content) {
          content = newContent
          modified = true
        }
      }

      // Only write back if the file was modified
      if (modified) {
        await fs.writeFile(file, content, 'utf8')
        console.log(`Processed imports in: ${path.relative(rootDir, file)}`)
      }
    }

    console.log('Import processing completed successfully!')
  } catch (error) {
    console.error('Error processing imports:', error)
    process.exit(1)
  }
}

main()
