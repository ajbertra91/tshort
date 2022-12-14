import type { NextPage } from 'next';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import styles from '../styles/Home.module.css';
import { trpc } from '../utils/trpc';
import { RiFileCopyLine } from "react-icons/ri";

const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  const mutation = trpc.useMutation(['set-slug']);
  const [shortUrl, setShortUrl] = useState("");

  const generateSlug = (length: number): string => {
    var slug = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      slug += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return slug;
  }

  const handleUrlChange = (url: string) => {
    const hasHttp = /http\:\/\//g.test(url);
    const hasHttps = /https\:\/\//g.test(url);
    setUrl((hasHttp || hasHttps) ? url : `https://${url}`);
  }

  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    if (url.length > 0) {
      const slug = generateSlug(8);
      mutation.mutate({ slug, url });
      console.log(process.env.NODE_ENV);
      const tshort = process.env.NODE_ENV === 'development' ? `http://localhost:3000/api/${slug}` : `https://tshort-ruby.vercel.app/api/${slug}`
      setShortUrl(tshort);
    }
    return;
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    }
    catch (err) {
      console.error('Async: Could not copy text: ', err);
    };
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
          <div className={styles.card}>
            <form onSubmit={(e: FormEvent) => handleClick(e)}>
              <input
                className={styles.input}
                type="text"
                placeholder="example.com"
                onChange={(e: ChangeEvent) => handleUrlChange((e.target as HTMLInputElement).value)}/>

              <button type="submit" className={styles.button}>Shorten URL</button>
            </form>
          </div>

          {shortUrl ?
            <div
              className={styles.card}
              onClick={() => copyUrl()}
            >
              {shortUrl}
              <RiFileCopyLine />
            </div> : null
          }
        </div>
      </main>

      <footer className={styles.footer}>
        footer stuff
      </footer>
    </div>
  )
}

export default Home
