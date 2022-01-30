import Link from 'next/link';
import styles from './thanks.module.css';

export default function Thanks() {
  return (
    <>
      <h2 className={styles.header}>Takk for ditt bidrag til Skeivt kulturårs arrangementkalender</h2>
      <p className={styles.p}>
        Du vil ikke aktivt se at arrangementet legger seg i kalender, da den trenger å gå gjennom en moderator.
      </p>
      <p className={styles.p}>
        <Link href="/">
          <a className={styles.link}>Gå til kalender</a>
        </Link>
      </p>
    </>
  );
}
