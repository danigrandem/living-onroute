import Link from "next/link";
import * as prismic from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { createClient } from "../prismicio";
import { Bounded } from "./Bounded";
import { Heading } from "./Heading";
import { HeaderMenu } from "./HeaderMenu";
import { getParents, getAllCategories } from "../utils";

const Profile = ({ name, description, profilePicture }) => {
  return (
    <div className="px-4">
      <div className="grid max-w-lg grid-cols-1 justify-items-center gap-8">
        <PrismicNextLink href="/" tabIndex="-1">
          <div className="relative h-40 w-40 overflow-hidden rounded-full bg-slate-300">
            {prismic.isFilled.image(profilePicture) && (
              <PrismicNextImage
                field={profilePicture}
                fill={true}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        </PrismicNextLink>
        {(prismic.isFilled.richText(name) ||
          prismic.isFilled.richText(description)) && (
            <div className="grid grid-cols-1 gap-2 text-center">
              {prismic.isFilled.richText(name) && (
                <Heading>
                  <PrismicNextLink href="/">
                    <PrismicText field={name} />
                  </PrismicNextLink>
                </Heading>
              )}
              {prismic.isFilled.richText(description) && (
                <p className="font-serif text-2xl italic leading-normal tracking-tight text-slate-500">
                  <PrismicText field={description} />
                </p>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

const NavItem = ({ children }) => {
  return (
    <li className="font-semibold tracking-tight text-slate-800">{children}</li>
  );
};

export const Header = async ({
  withDivider = true,
  withProfile = true,
}) => {
  const client = createClient();
  const graphQuery = `
  {
    article {
      title
      category {
        slug
        level
        parent {
          slug
          level
        }
      }
    }
  }
  `;

  const articles = await client.getAllByType("article", { graphQuery });

  const regionArticles = articles.filter(
    (article) => article.data.category?.data.level === 'region'
  );
  const allCategories = await getAllCategories()
  const menu = {};

  // Helper function to get the full hierarchy for a region
  function getParentHierarchy(slug, categories, hierarchy = []) {
    const category = categories.find((cat) => cat.data.slug === slug);
    if (!category) return hierarchy;

    // Add the full category details to the hierarchy array
    hierarchy.unshift({
      name: category.data.name,
      slug: category.data.slug,
      level: category.data.level,
      parent: category.data.parent,
    });

    // Continue traversing up the parent hierarchy
    if (category.data.parent && category.data.parent.slug) {
      return getParentHierarchy(category.data.parent.slug, categories, hierarchy);
    }

    return hierarchy;
  }

  // Process each article
  regionArticles.forEach((article) => {
    const categorySlug = article.data.category.slug;

    // Get the full hierarchy for the region
    const hierarchy = getParents(categorySlug, allCategories);

    if (hierarchy.length >= 3) {
      // Extract continent, country, and region details
      const [continent, country, region] = hierarchy;

      // Initialize the structure if not present
      if (!menu[continent.slug]) {
        menu[continent.slug] = {
          name: continent.name,
          slug: continent.slug,
          level: continent.level,
          childs: {},
        };
      }

      if (!menu[continent.slug].childs[country.slug]) {
        menu[continent.slug].childs[country.slug] = {
          name: country.name,
          slug: country.slug,
          level: country.level,
          childs: [],
        };
      }

      // Add the region if it's not already present
      const existingRegions = menu[continent.slug].childs[country.slug].childs;
      if (!existingRegions.find((r) => r.slug === region.slug)) {
        existingRegions.push({
          name: region.name,
          slug: region.slug,
          level: region.level,
        });
      }
    }
  });
  console.log("k sale 2a", menu)
  return (
    <Bounded as="header" size="wider">
      <div className="flex justify-between gap-20">
        <Link href="/">
          LOGO
        </Link>

        <HeaderMenu menuData={menu} />
        <nav>
          <ul className="flex flex-wrap justify-center gap-10">
            {false && navigation.data?.links.map((item) => (
              <NavItem key={prismic.asText(item.label)}>
                <PrismicNextLink field={item.link}>
                  <PrismicText field={item.label} />
                </PrismicNextLink>
              </NavItem>
            ))}
          </ul>

        </nav>
        <div />
      </div>
    </Bounded>
  );
};
