/**
 * Ürün kataloğu — CRM bağlanana kadar statik veri
 * CRM hazır olunca bu dosya API çağrılarına dönüşecek
 */

export type Product = {
  slug: string;
  name: string;
  collection: string;
  collectionSlug: string;
  brand: "gabba" | "monett";
  price: number;
  image: string;
  layout: "vertical" | "horizontal";
  category: "sofa" | "chair" | "table" | "case" | "bed";
  inStock: boolean;
  description: string;
  materials: string;
};

export type Collection = {
  slug: string;
  name: string;
  brand: "gabba" | "monett";
  description: string;
  image: string;
  productCount: number;
};

export const collections: Collection[] = [
  {
    slug: "madrid",
    name: "Madrid",
    brand: "gabba",
    description: "Класична елегантність у кремових тонах. Дивани, столи, консолі — цілісний інтер'єр для тих, хто цінує бездоганний стиль.",
    image: "/images/collections/madrid.jpg",
    productCount: 4,
  },
  {
    slug: "luna",
    name: "Luna",
    brand: "monett",
    description: "Плавні силуети та ніжна палітра, натхненні світлом місяця. М'якість форм та тепло натуральних матеріалів.",
    image: "/images/collections/luna.jpg",
    productCount: 1,
  },
  {
    slug: "montana",
    name: "Montana",
    brand: "gabba",
    description: "Натуральне дерево та масивні форми для інтер'єрів з характером. Сучасний мінімалізм з природними текстурами.",
    image: "/images/collections/montana.jpg",
    productCount: 2,
  },
  {
    slug: "leora",
    name: "Leora",
    brand: "gabba",
    description: "Витончена розкіш. Гармонія форми та функції для вишуканих інтер'єрів.",
    image: "/images/collections/leora.jpg",
    productCount: 0,
  },
  {
    slug: "moka",
    name: "Moka",
    brand: "monett",
    description: "Теплі тони та органічні форми для стильного простору. Затишок та сучасний дизайн в одному.",
    image: "/images/collections/moka.jpg",
    productCount: 0,
  },
];

export const products: Product[] = [
  {
    slug: "madrid-sofa",
    name: "Диван Madrid",
    collection: "Madrid",
    collectionSlug: "madrid",
    brand: "gabba",
    price: 101582,
    image: "/images/products/madrid-sofa.jpg",
    layout: "horizontal",
    category: "sofa",
    inStock: true,
    description: "Розкішний диван з колекції Madrid. Класичні лінії, преміальна оббивка та бездоганний комфорт для вашої вітальні.",
    materials: "Каркас: масив бука. Оббивка: преміальна тканина. Наповнювач: високоеластичний ППУ + пружинний блок.",
  },
  {
    slug: "milano-armchair",
    name: "Крісло Milano",
    collection: "Milano",
    collectionSlug: "madrid",
    brand: "gabba",
    price: 50791,
    image: "/images/products/milano-armchair.jpg",
    layout: "vertical",
    category: "chair",
    inStock: true,
    description: "Елегантне крісло Milano — ідеальний акцент для вітальні або кабінету. Ергономічна форма та преміальні матеріали.",
    materials: "Каркас: масив бука. Оббивка: італійська шкіра / тканина. Ніжки: матовий метал.",
  },
  {
    slug: "milano-sofa",
    name: "Диван Milano",
    collection: "Milano",
    collectionSlug: "madrid",
    brand: "gabba",
    price: 115597,
    image: "/images/products/milano-sofa.jpg",
    layout: "horizontal",
    category: "sofa",
    inStock: true,
    description: "Флагманський диван Milano. Просторий, комфортний, з бездоганною увагою до кожної деталі.",
    materials: "Каркас: масив бука. Оббивка: преміальна тканина. Наповнювач: високоеластичний ППУ + пружинний блок.",
  },
  {
    slug: "montana-armchair",
    name: "Крісло Montana Lux",
    collection: "Montana",
    collectionSlug: "montana",
    brand: "gabba",
    price: 44977,
    image: "/images/products/montana-armchair.jpg",
    layout: "vertical",
    category: "chair",
    inStock: true,
    description: "Крісло Montana Lux — натуральне дерево та сучасний дизайн. Ідеальне поєднання комфорту та стилю.",
    materials: "Каркас: натуральний дуб. Оббивка: преміальна тканина. Сидіння: анатомічна подушка.",
  },
  {
    slug: "genova-chair",
    name: "Стілець Genova",
    collection: "Montana",
    collectionSlug: "montana",
    brand: "gabba",
    price: 18143,
    image: "/images/products/genova-chair.jpg",
    layout: "vertical",
    category: "chair",
    inStock: true,
    description: "Стілець Genova — мінімалістичний дизайн з натурального дерева. Легкий, міцний та стильний.",
    materials: "Каркас: масив бука. Сидіння: м'яка подушка з тканинною оббивкою.",
  },
  {
    slug: "lyon-tv-unit",
    name: "TV Юніт Lyon",
    collection: "Lyon",
    collectionSlug: "madrid",
    brand: "gabba",
    price: 75707,
    image: "/images/products/lyon-tv-unit.jpg",
    layout: "horizontal",
    category: "case",
    inStock: true,
    description: "TV юніт Lyon — елегантне рішення для зберігання та організації медіа-зони. Кремові тони та чисті лінії.",
    materials: "Корпус: МДФ з шпоном дуба. Фурнітура: преміальна, з м'яким закриванням.",
  },
  {
    slug: "madrid-console",
    name: "Консоль Madrid",
    collection: "Madrid",
    collectionSlug: "madrid",
    brand: "gabba",
    price: 102860,
    image: "/images/products/madrid-console.jpg",
    layout: "horizontal",
    category: "case",
    inStock: true,
    description: "Консоль Madrid — функціональний та естетичний предмет для передпокою або вітальні. Класична елегантність.",
    materials: "Корпус: МДФ з шпоном. Стільниця: натуральний камінь / МДФ. Фурнітура: преміальна.",
  },
  {
    slug: "madrid-table",
    name: "Стіл Madrid",
    collection: "Madrid",
    collectionSlug: "madrid",
    brand: "gabba",
    price: 69318,
    image: "/images/products/madrid-table.jpg",
    layout: "horizontal",
    category: "table",
    inStock: true,
    description: "Обідній стіл Madrid — центральний елемент вашої їдальні. Розкішний дизайн та надійна конструкція.",
    materials: "Стільниця: керамограніт / МДФ з шпоном. Каркас: метал з порошковим покриттям.",
  },
  {
    slug: "galante-bed",
    name: "Ліжко Galante",
    collection: "Galante",
    collectionSlug: "madrid",
    brand: "gabba",
    price: 147941,
    image: "/images/products/galante-bed.jpg",
    layout: "horizontal",
    category: "bed",
    inStock: true,
    description: "Ліжко Galante — преміальне ліжко з м'яким узголів'ям. Розкіш та комфорт для вашої спальні.",
    materials: "Каркас: масив бука. Узголів'я: м'яке, з преміальною тканиною. Основа: ортопедичні ламелі.",
  },
  {
    slug: "luna-armchair",
    name: "Крісло Luna",
    collection: "Luna",
    collectionSlug: "luna",
    brand: "monett",
    price: 43444,
    image: "/images/products/luna-armchair.jpg",
    layout: "vertical",
    category: "chair",
    inStock: true,
    description: "Крісло Luna — м'які форми та ніжні тони. Створено для максимального комфорту та затишку.",
    materials: "Каркас: масив бука. Оббивка: велюр / тканина. Наповнювач: високоеластичний ППУ.",
  },
  {
    slug: "terra-dresser",
    name: "Комод Terra",
    collection: "Terra",
    collectionSlug: "montana",
    brand: "gabba",
    price: 80179,
    image: "/images/products/terra-dresser.jpg",
    layout: "vertical",
    category: "case",
    inStock: true,
    description: "Комод Terra — натуральні текстури та функціональний дизайн. Ідеальне рішення для зберігання.",
    materials: "Корпус: МДФ з шпоном дуба. Фурнітура: преміальна, з м'яким закриванням. Ніжки: масив дуба.",
  },
  {
    slug: "terra-table",
    name: "Стіл Terra",
    collection: "Terra",
    collectionSlug: "montana",
    brand: "gabba",
    price: 103499,
    image: "/images/products/terra-table.jpg",
    layout: "horizontal",
    category: "table",
    inStock: true,
    description: "Стіл Terra — масивний обідній стіл з натуральними текстурами. Центральний елемент вашої їдальні.",
    materials: "Стільниця: натуральний шпон дуба. Каркас: масив дуба / метал.",
  },
];

export function getCollections(): Collection[] {
  return collections;
}

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return products.filter((p) => p.collectionSlug === collectionSlug);
}

export function formatPrice(price: number): string {
  return "₴" + price.toLocaleString("uk-UA");
}
