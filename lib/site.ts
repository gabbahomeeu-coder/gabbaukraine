/**
 * Site geneli sabitler — iletişim, şubeler, sosyal
 * Tek kaynak: hem sayfa içeriği hem JSON-LD buradan beslenir
 */

export const PHONE = "+380990042222";
export const PHONE_DISPLAY = "+38 099 004 22 22";
export const WA_LINK = "https://wa.me/380990042222";
export const INSTAGRAM = "https://www.instagram.com/gabba.home";

export const STORES = [
  { city: "Київ", address: "ТЦ 4ROOM, 1 поверх" },
  { city: "Львів", address: "ТЦ TRY SLONY, 2 поверх" },
  { city: "Одеса", address: "ТЦ MEGADOM, 2 поверх" },
];

export const CATEGORIES = [
  { img: "soft-furniture", name: "М'які меблі", slug: "sofa" },
  { img: "tables", name: "Столи", slug: "table" },
  { img: "chairs", name: "Крісла та стільці", slug: "chair" },
  { img: "case-furniture", name: "Корпусні меблі", slug: "case" },
  { img: "bedroom", name: "Спальня", slug: "bed" },
];

export const REVIEWS = [
  {
    text: "Замовляли диван Madrid — якість неймовірна. Тканина приємна на дотик, каркас міцний. Доставка та збірка були бездоганними.",
    author: "Олена Коваленко",
    city: "Київ",
    product: "Диван Madrid",
  },
  {
    text: "Обрали крісло Montana Lux для вітальні. Виглядає розкішно, сидіти дуже зручно. Рекомендую GABBA всім друзям.",
    author: "Андрій Мельник",
    city: "Львів",
    product: "Крісло Montana Lux",
  },
  {
    text: "Повністю обставили квартиру меблями GABBA. Від консультації до збірки — все на найвищому рівні. Дякуємо команді!",
    author: "Марина Шевченко",
    city: "Одеса",
    product: "Колекція Madrid",
  },
];
