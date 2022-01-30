import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export function isEmptyResult(result: object | null): boolean {
  if (result === null) return true;
  return Object.keys(result).length === 0;
}

export const PROJECT_ID = process.env.SANITY_PROJECTID || "qq11a4zu";
export const DATASET = process.env.SANITY_STUDIO_API_DATASET || "development";

const sanity = sanityClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: process.env.SANITY_ACCESS_TOKEN,
  apiVersion: "2021-12-19",
});

const builder = imageUrlBuilder(sanity);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export default sanity;
