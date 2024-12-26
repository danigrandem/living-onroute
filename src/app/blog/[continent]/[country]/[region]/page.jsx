import * as prismic from "@prismicio/client";
import { createClient } from "../../../../../prismicio";
import {  checkPath,getChildArticles, getAllCategories, getParentSlugs, getStaticParams } from "../../../../../utils";
import { PrismicText, SliceZone } from "@prismicio/react";
import { notFound } from 'next/navigation'


export async function generateStaticParams() {
  return getStaticParams('region')
}

export default async function RegionPage({ params }) {
  
  const client = createClient();
  const data = await params
  const { uid,continent, country,region }=data
  await checkPath({continent,country, region})
  const article = await client.getByUID("article", region).catch(() => notFound());;
  const {currentArticles, childArticles} = await getChildArticles(country)

  console.log("childArticles",currentArticles)
  return (
    <div>
      <PrismicText field={article.data.title} />
      <p>Located in: {continent}</p>
    </div>
  );
}

export const dynamic = 'force-static'
export const dynamicParams = false