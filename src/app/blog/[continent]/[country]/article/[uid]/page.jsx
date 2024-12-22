import * as prismic from "@prismicio/client";
import { createClient } from "../../../../../prismicio";

export async function generateStaticParams() {
  const client = createClient();

  // Obtén los artículos relacionados con países
  const articles = await client.getAllByType("article", {
    predicates: [prismic.predicate.at("my.category.level", "country")],
  });

  return articles.map((article) => ({
    continent: article.data.category.parent.slug,
    country: article.data.category.slug,
    uid: article.uid,
  }));
}

export default async function ArticleInCountryPage({ params }) {
  const client = createClient();

  const article = await client.getByUID("article", params.uid);

  return (
    <div>
      <h1>{article.data.title}</h1>
      <p>Located in: {params.continent} / {params.country}</p>
    </div>
  );
}
