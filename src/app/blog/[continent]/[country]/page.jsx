import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";
import Link from "next/link";

export async function generateStaticParams() {
  const client = createClient();

  // Obtén todos los países
  const countries = await client.getAllByType("category", {
    predicates: [prismic.predicate.at("my.category.level", "country")],
  });

  return countries.map((country) => ({
    continent: country.data.parent.slug,
    country: country.slug,
  }));
}

export default async function CountryPage({ params }) {
  const client = createClient();

  // Obtén las regiones del país actual
  const regions = await client.getAllByType("category", {
    predicates: [
      prismic.predicate.at("my.category.level", "region"),
      prismic.predicate.at("my.category.parent", params.country),
    ],
  });

  // Obtén los artículos directamente relacionados con el país
  const articles = await client.getAllByType("article", {
    predicates: [
      prismic.predicate.at("my.category.slug", params.country),
    ],
  });

  return (
    <div>
      <h1>{params.country.toUpperCase()}</h1>

      <h2>Regions</h2>
      <ul>
        {regions.map((region) => (
          <li key={region.id}>
            <Link href={`/${params.continent}/${params.country}/${region.slug}`}>
              {region.data.name}
            </Link>
          </li>
        ))}
      </ul>

      <h2>Articles About {params.country}</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/${params.continent}/${params.country}/${article.uid}`}>
              {article.data.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
