import * as prismic from "@prismicio/client";
import { createClient } from "../../../../prismicio";
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
    (article) => article.data.category?.data.level === "region"
  );

  
  return filteredArticles.map((article) => ({
    region: article.data.category.slug,
    uid: article.uid,
  }));
}

export default async function RegionPage({ params }) {

  return null
  const client = createClient();

  const { uid,region } = await params
console.log("joder mierda", uid, region)
  const article = await client.getByUID("article", uid);
  console.log("calla2,",article.data.title)
  return (
    <div>
      <PrismicText field={article.data.title} />
      <p>Located in: {region}</p>
    </div>
  );
}
