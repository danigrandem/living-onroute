import * as prismic from "@prismicio/client";
import { createClient } from "../../../../../prismicio";
import {  checkPath, getStaticParams } from "../../../../../utils";
import { PrismicText, SliceZone } from "@prismicio/react";


export async function generateStaticParams() {
  return getStaticParams('continent')
}

export default async function ArticleInContinentPage({ params }) {
  const client = createClient();
  const data = await params
  const { uid,continent }=data
  await checkPath({continent})
  if(continent === uid){
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