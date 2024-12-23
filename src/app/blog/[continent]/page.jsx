import * as prismic from "@prismicio/client";
import { createClient } from "../../../prismicio";
import {  checkPath } from "../../../utils";
import { PrismicText, SliceZone } from "@prismicio/react";
import { notFound } from 'next/navigation'


export async function generateStaticParams() {
  const client = createClient();



  // Obtén los artículos directamente relacionados con continentes
  const graphQuery = `
  {
    article {
      title
      category {
        slug
        level
      }
    }
  }
  `;
  
  const articles = await client.getAllByType("article", { graphQuery });
  
  const filteredArticles = articles.filter(
    (article) => article.data.category?.data.level === "continent"
  );

  return filteredArticles.map((article) => ({
    continent: article.data.category.slug,
    uid: article.uid,
  }));
}

export default async function ContinentPage({ params }) {
  
  const client = createClient();
  const data = await params
  const { uid,continent, country }=data
  await checkPath({continent,country})
  const article = await client.getByUID("article", continent).catch(() => notFound());;
  
  return (
    <div>
      <PrismicText field={article.data.title} />
      <p>Located in: {continent}</p>
    </div>
  );
}
