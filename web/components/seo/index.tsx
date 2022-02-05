import Head from 'next/head';

type SEOProps = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};
const SEO = ({ url = 'https://skeivkulturkalender.no', title, description, image }: SEOProps) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
  </Head>
);

export default SEO;
