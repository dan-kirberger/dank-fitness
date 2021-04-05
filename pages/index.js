import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dank Fitness</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to DanK Fitness
        </h1>
        <p>Pick a Tool:</p>
        <ul><li><Link href="tools/plates">Gibbens Calculator</Link></li></ul>
      </main>
    </div>
  )
}
