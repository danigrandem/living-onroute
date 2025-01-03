import * as prismic from "@prismicio/client";
import { createClient } from "../../../../prismicio";
import {  checkPath,getChildArticles, getStaticParams } from "../../../../utils";
import { PrismicText, SliceZone } from "@prismicio/react";
import { notFound } from 'next/navigation'


export async function generateStaticParams() {
  return getStaticParams('country')
}

export default async function CountryPage({ params }) {
  const client = createClient();
  const data = await params
  const { uid,continent, country }=data
  await checkPath({continent,country})
  const article = await client.getByUID("article", country).catch(() => notFound());

  const graphQuery = `
  {
    article {
      title
      category {
        name
        slug
        level
        parent
      }
    }
  }
  `;
  
  const articles = await client.getAllByType("article", { graphQuery });
  // Filter articles dynamically where category.parent.slug === "asia"
  const childRegionCountryArticles = articles.filter(
    (article) => article.data.category?.data?.parent?.slug === country
  );

  const childCountryArticles = articles.filter(
    (article) => article.data.category?.slug === country
  );

  const {currentArticles, childArticles} = await getChildArticles(country)

  return (
    <div>
      <PrismicText field={article.data.title} />
      <p>Located in: {continent}</p>
    </div>
  );
}

export const dynamic = 'force-static'
export const dynamicParams = false