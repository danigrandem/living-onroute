/**
 * @typedef {import("@prismicio/client").Content.CategorySlice} CategorySlice
 * @typedef {import("@prismicio/react").SliceComponentProps<CategorySlice>} CategoryProps
 * @param {CategoryProps}
 */
const Category = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for category (variation: {slice.variation}) Slices
    </section>
  );
};

export default Category;
