import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Dank Fitness</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
        <h1>
          Welcome to DanK Fitness
        </h1>
        <p>That left nav bar is pretty janky, have fun.</p>
      </main>
    </div>
  )
}
