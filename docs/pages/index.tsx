import Head from 'next/head'
import Link from "next/link"

export default function Home() {
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
    </div>
  )
}
