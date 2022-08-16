import type { NextPage } from 'next'
import Head from 'next/head'
import { ChangeEvent, useState } from 'react'
import styles from '../styles/Home.module.css'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const mutation = trpc.useMutation(['set-slug']);

  const generateSlug = (): string => {
    // TODO generate a complex slug
    const slugs = ['rock', 'paper', 'scissors', 'tin', 'paper', 'stone'];
    const slug = slugs[Math.floor(Math.random() * slugs.length)];
    return slug;
  }

  const handleUrlChange = (url: string) => {
    const hasHttp = /http\:\/\//g.test(url);
    const hasHttps = /https\:\/\//g.test(url);
    console.log('hasHttp?', hasHttp)
    console.log('hasHttps?', hasHttps)
    setUrl((hasHttp || hasHttps) ? url : `https://${url}`);
  }

  const handleClick = () => {
    if (url.length > 0) {
      console.log(url);
      const slug = generateSlug();
      console.log(slug);
      mutation.mutate({ slug, url })
    }
    return;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>TShort URL Shortener</title>
        <meta name="description" content="TShort URL Shortener" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          TShort your URL
        </h1>

        <p className={styles.description}>
          Enter an URL to shorten:
        </p>

        <div className={styles.grid}>
          <input
            type="text"
            placeholder="example.com"
            onChange={(e: ChangeEvent) => handleUrlChange((e.target as HTMLInputElement).value)}/>

          <button onClick={() => handleClick()}>Shorten URL</button>
        </div>
      </main>

      <footer className={styles.footer}>
        footer stuff
      </footer>
    </div>
  )
}

export default Home
