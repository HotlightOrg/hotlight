import fs from 'fs'
import path from 'path'

export const DOCS_PATH = path.join(process.cwd(), 'docs')

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const docFilePaths = fs
  .readdirSync(DOCS_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path))

export const EXAMPLES_PATH = path.join(process.cwd(), '_examples')

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const exampleFilePaths = fs
  .readdirSync(EXAMPLES_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path))
