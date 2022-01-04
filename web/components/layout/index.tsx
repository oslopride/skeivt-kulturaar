import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, useRef } from 'react';

import styles from './layout.module.css';

export type LayoutProps = {
  children: ReactNode;
  image?: string | null;
  title?: string | null;
  subTitle?: string | null;
};
export default function Layout({ children, image, title, subTitle }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Skeivt Kulturår</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <header className={styles.header}>
        {image && (
          <div className={styles.imgContainer}>
            <Image alt="" src={image} layout="fill" className={styles.backgroundImage} />
          </div>
        )}
        <div className={styles.headerContent}>
          <div className={styles.topContainer}>
            <div className={styles.logoContainer}>
              <Image src="/logo.png" width="272" height="154" alt="Skeivt Kulturår logo" className={styles.logo} />
            </div>
            <nav aria-label="Main navigation" className={styles.headerNav}>
              <ul>
                <li>
                  <Link href="/">Arrangementer</Link>
                </li>
                <li>
                  <Link href="/about">Om Skeivt Kulturår</Link>
                </li>
                <li className={styles.submitLink}>
                  <Link href="/submit">Meld inn arrangement</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className={styles.container}>
            <h1>{title}</h1>
            <p>{subTitle}</p>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
