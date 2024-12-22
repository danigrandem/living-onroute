import { createClient } from "@/prismicio";

export async function generateStaticParams() {
  const client = createClient();

  // Obtén los artículos relacionados con regiones
  const articles = await client.getAllByType("article", {
    fetchLinks: ["category.name", "category.slug", "category.parent"],
  });

  // Genera rutas dinámicas basadas en las categorías jerárquicas
  return articles
    .filter((article) => {
      const category = article.data.category;
      return category && category.level === "region"; // Solo artículos relacionados con regiones
    })
    .map((article) => ({
      continent: article.data.category.parent.parent.slug, // Continente
      country: article.data.category.parent.slug, // País
      region: article.data.category.slug, // Región
      uid: article.uid, // UID del artículo
    }));
}

export default async function ArticleInRegionPage({ params }) {
  const client = createClient();

  // Obtén el artículo por su UID
  const article = await client.getByUID("article", params.uid, {
    fetchLinks: ["category.name", "category.slug", "category.parent"],
  });

  if (!article) {
    return <h1>Article Not Found</h1>;
  }

  // Construir la jerarquía de categorías
  const region = article.data.category;
  const country = region.parent;
  const continent = country.parent;

  return (
    <div>
      <h1>{article.data.title}</h1>
      <p>Located in: {continent.name} / {country.name} / {region.name}</p>
      <div dangerouslySetInnerHTML={{ __html: article.data.content }} />
    </div>
  );
}
