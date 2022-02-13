import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import BlockContent from '@sanity/block-content-to-react';

import sanity, { DATASET, PROJECT_ID, urlFor } from '../sanity';
import Layout from '../components/layout';
import SEO from '../components/seo';

export default function PrivacyPolicy({
  image,
  title,
  subTitle,
  bodyText,
  bodyTitle,
  metaTitle,
  metaDescription,
  metaImage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout title={title} subTitle={subTitle} image={image}>
      <SEO image={metaImage} title={metaTitle} description={metaDescription} />

      <h2>{bodyTitle}</h2>
      <BlockContent blocks={bodyText} projectId={PROJECT_ID} dataset={DATASET} />
    </Layout>
  );
}

export type Data = {
  image?: string | null;
  title?: string | null;
  subTitle?: string | null;
  bodyText?: any;
  bodyTitle?: string | null;
  metaTitle: string;
  metaDescription: string;
  metaImage: string;
};
export const getStaticProps: GetStaticProps = async () => {
  const query = `{
    "configuration": *[_id in ["global_configuration"]] [0],
    "privacy": *[_id in ["global_privacy"]] [0],
  }`;
  const res = await sanity.fetch(query);
  const image = urlFor(res?.configuration?.header?.background).auto('format').url().toString();
  const metaImage = urlFor(res?.configuration?.header?.background).size(1200, 630).auto('format').url().toString();

  return {
    props: {
      bodyText: res?.privacy?.body || null,
      bodyTitle: res?.privacy?.title || null,
      image: image || null,
      title: res?.configuration?.header?.title || null,
      subTitle: res?.configuration?.header?.subtitle || null,
      metaTitle: res?.configuration?.meta?.title || '',
      metaDescription: res?.configuration?.meta?.description || '',
      metaImage,
    },
    revalidate: 86400, // 24 hrs
  };
};
