import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import BlockContent from '@sanity/block-content-to-react';

import sanity, { urlFor } from '../sanity';
import Layout from '../components/layout';

export default function About({
  image,
  title,
  subTitle,
  aboutBody,
  aboutTitle,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout title={title} subTitle={subTitle} image={image}>
      <h2>{aboutTitle}</h2>
      <BlockContent blocks={aboutBody} />
    </Layout>
  );
}

export type Data = {
  image?: string | null;
  title?: string | null;
  subTitle?: string | null;
  aboutBody?: any;
  aboutTitle?: string | null;
};
export const getStaticProps: GetStaticProps = async () => {
  const query = `{
    "configuration": *[_id in ["global_configuration", "drafts.global_configuration"]] | order(_updatedAt desc) [0],
    "about": *[_id in ["global_about", "drafts.global_about"]] | order(_updatedAt desc) [0],
  }`;
  const res = await sanity.fetch(query);
  const image = urlFor(res?.configuration?.header?.background).auto('format').url().toString();

  return {
    props: {
      aboutBody: res?.about?.body,
      aboutTitle: res?.about?.title,
      image: image || null,
      title: res?.configuration?.header?.title || null,
      subTitle: res?.configuration?.header?.subtitle || null,
    },
    revalidate: 3600,
  };
};
