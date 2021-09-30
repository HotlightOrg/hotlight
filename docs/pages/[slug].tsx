import { GetStaticProps } from "next";
import { ReactNode } from "react";
import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import html from 'remark-html';
import prism from 'remark-prism';

import CustomLink from 'components/CustomLink';
import CommandKLauncher from "components/CommandKLauncher";
import { docFilePaths, DOCS_PATH } from 'utils/mdxUtils';

type Doc = {
  content: string;
  data: {
    [key: string]: string;
  };
  docPath: string;
}

// https://motion.dev/
type Props = {
  children: ReactNode;
  docs: Doc[];
}
const Layout = ({ children, docs }: Props) => {
  return (
    <div className="container mx-auto max-w-screen-md">
      <header>
        <nav>
          <Link href="/">
            <a>CommandK</a>
          </Link>
        </nav>
      </header>
      <div className="flex flex-row gap-x-10">
        <aside className="w-1/3">
          <ul>
            {docs.map((doc) => (
              <li key={doc.docPath}>
                <Link
                  href={`/${doc.docPath.replace(/\.mdx?$/, '')}`}
                >
                  <a>{doc.data.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}

const components = {
  a: CustomLink,
  Launcher: CommandKLauncher
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  //TestComponent: dynamic(() => import('../../components/TestComponent')),
  //Head,
}

type DocPageProps = {
  docs: Doc[];
  source: {
    compiledSource: string;
    scope: {
      [key: string]: string
    }
  }
};

const DocPage = ({ docs, source }: DocPageProps) => {
  return (
    <Layout docs={docs}>
      <MDXRemote {...source} components={components} />
    </Layout>
  )
}

export const getStaticPaths = async () => {
  const paths = docFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if(params === undefined) {
    return {
      notFound: true
    }
  }

  const docFilePath = path.join(DOCS_PATH, `${params.slug}.mdx`)
  const fileSource = fs.readFileSync(docFilePath)

  const { content, data: frontMatter } = matter(fileSource)

  // this slugs doc
  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [html, prism],
      rehypePlugins: [],
    },
    scope: frontMatter,
  })

  // all docs
  const docs = docFilePaths.map((docPath: string) => {
    const source = fs.readFileSync(path.join(DOCS_PATH, docPath))
    const { content, data } = matter(source)

    return {
      content,
      data,
      docPath,
    }
  })

  return { props: { docs, source, frontMatter } }
}

export default DocPage;
