import * as prismic from "@prismicio/client";
import { createClient } from "../../../../../prismicio";
import {  checkPath } from "../../../../../utils";
import { PrismicText, SliceZone } from "@prismicio/react";


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
    "continent-[continent]": article.data.category.slug,
  }));
}

export default async function ArticleInContinentPage({ params }) {
  const client = createClient();
  const data = await params
  const { uid,continent }=data
  await checkPath({continent})
  const article = await client.getByUID("article", uid);
  return (
    <div>
      <PrismicText field={article.data.title} />
      <p>Located in: {continent}</p>
    </div>
  );
}
