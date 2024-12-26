import * as prismic from "@prismicio/client";
import { createClient } from "../../../../../../prismicio";
import {  checkPath, getStaticParams } from "../../../../../../utils";
import { PrismicText, SliceZone } from "@prismicio/react";
import { notFound } from 'next/navigation'


export async function generateStaticParams() {
  return getStaticParams('country')
}

export default async function ArticleCountryPage({ params }) {
  
  const client = createClient();
  const data = await params
  const { uid,continent, country }=data
  await checkPath({continent,country})
  if(country === uid){
    notFound()
  }
  const article = await client.getByUID("article", uid).catch(() => notFound());
  return (
    <div>
      <PrismicText field={article.data.title} />
      <p>Located in: {continent}</p>
    </div>
  );
}

export const dynamic = 'force-static'
export const dynamicParams = false
