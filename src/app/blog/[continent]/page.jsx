import * as prismic from "@prismicio/client";
import { createClient } from "../../../prismicio";
import {  checkPath,getChildArticles, getStaticParams } from "../../../utils";
import { PrismicText, SliceZone } from "@prismicio/react";
import { notFound } from 'next/navigation'


export async function generateStaticParams() {
  return getStaticParams('continent')
}

export default async function ContinentPage({ params }) {
  
  const client = createClient();
  const data = await params
  const { uid,continent, country }=data
  await checkPath({continent,country})
  const article = await client.getByUID("article", continent).catch(() => notFound());;
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