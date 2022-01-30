import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

import Layout from '../components/layout';
import sanity, { urlFor } from '../sanity';
import styles from '../styles/thanks.module.css';

export default function SubmitEvent({
  image,
  title,
  subTitle,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout title={title} subTitle={subTitle} image={image}>
      <h2 className={styles.header}>Takk for ditt bidrag til Skeivt kulturårs arrangementkalender</h2>
      <p className={styles.p}>
        Du vil ikke aktivt se at arrangementet legger seg i kalender, da den trenger å gå gjennom en moderator.
      </p>
      <p className={styles.p}>
        <Link href="/">
          <a className={styles.link}>Gå til kalender</a>
        </Link>
      </p>
    </Layout>
  );
}

export type Data = {
  image?: string | null;
  title?: string | null;
  subTitle?: string | null;
};
export const getServerSideProps: GetServerSideProps = async () => {
  const res = await sanity.fetch(
    `*[_id in ["global_configuration", "drafts.global_configuration"]] | order(_updatedAt desc) [0]`
  );
  const image = urlFor(res?.header?.background).auto('format').url().toString();
  return {
    props: {
      image: image || null,
      title: res?.header?.title || null,
      subTitle: res?.header?.subtitle || null,
    },
  };
};
