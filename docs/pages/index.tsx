import { ReactNode } from "react";
import path from 'path';
import fs from 'fs';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import html from 'remark-html';
import prism from 'remark-prism';
import matter from 'gray-matter';
import Head from 'next/head'
import Link from "next/link"
import { exampleFilePaths, EXAMPLES_PATH } from "../utils/mdxUtils";
import CustomLink from 'components/CustomLink';

const components = {
  a: CustomLink,
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  //TestComponent: dynamic(() => import('../../components/TestComponent')),
  //Head,
}

type ExampleProps = {
  codeExample: Example;
  children: ReactNode;
}
const Example = ({ codeExample, children }: ExampleProps) => {
  return (
    <div className="border-b my-4">
      <div className="container mx-auto max-w-screen-lg flex flex-col md:flex-row">
        <div className="w-1/2">
          <MDXRemote {...codeExample} components={components} />
        </div>
        <div className="w-1/2 h-full w-full">
          <div className="bg-black">
            <iframe height="500" src="/example"></iframe>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

type Example = {
  scope: Record<string, unknown>;
  compiledSource: string;
}

type HomeProps = {
  examples: Example[];
}

export default function Home({ examples }: HomeProps) {
  return (
    <div>
      <Head>
        <title>Hotlight - keyboard shortcuts and search for your web app or site</title>
        <meta name="description" content="Easily add any action (create, remove, edit an object), hotkeys, site search and a quick way to navigate your app or site." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="container mx-auto">
        <Link
          href="/"
        >
          <a>Home</a>
        </Link>
      </nav>

      <main className="container mx-auto">
        <p>Logo</p>
        <h1 className="text-5xl font-bold">A great keyboard shortcut experience for your users in no time</h1>
        <p className="text-xl">A one minute installation that covers all your user needs when it comes to shortcuts and search.</p>
      </main>

      {examples.map((example, i) => (
        <Example
          key={i}
          codeExample={example}
        >
          Hej
        </Example>
      ))}
    </div>
  )
}

export const getStaticProps = async () => {
  const sources = exampleFilePaths.map(file => {
    const filePath = path.join(EXAMPLES_PATH, file)
    const fileSource = fs.readFileSync(filePath);
    const {
      content,
      data: frontMatter
    } = matter(fileSource);

    return serialize(content, {
      mdxOptions: {
        remarkPlugins: [html, prism],
        rehypePlugins: [],
      },
      scope: frontMatter,
    })
  });

  const all = await Promise
    .all(sources);

  return {
    props: {
      examples: all
    }
  }
}
