// Centralised presentation mapping for category card banners.  The API remains
// the source of category data; this is only a visual fallback for known themes.
const CATEGORY_IMAGES = {
  transport: 'https://static.vecteezy.com/system/resources/thumbnails/008/084/549/small/transport-vehicle-and-logistics-concept-3d-render-free-photo.JPG',
  electricity: 'https://media.istockphoto.com/id/1340413200/photo/aerial-view-of-a-high-voltage-substation.jpg?s=612x612&w=0&k=20&c=Nat7fUcivRPMID1-CowPHC7o-D_2R3E-8Tb2K9qf_14=',
  food: 'https://img.magnific.com/free-photo/pre-prepared-food-showcasing-ready-eat-delicious-meals-go_23-2151431678.jpg?semt=ais_test_b&w=740&q=80',
  shopping: 'https://blog.nationwide.com/wp-content/uploads/2024/05/Woman-shopping-in-a-store_393616055-002-1024x683.jpeg',
};

const normalise = (value = '') => value.toLowerCase().replace(/[^a-z]/g, '');

export const getCategoryImage = (category = {}) => {
  const candidates = [normalise(category.categoryName), normalise(category.categoryCode)];
  const key = Object.keys(CATEGORY_IMAGES).find((name) => candidates.some((candidate) => candidate.includes(name)));
  return CATEGORY_IMAGES[key] || CATEGORY_IMAGES.transport;
};

export default CATEGORY_IMAGES;
