export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GABBA",
    alternateName: "Gabba Home Ukraine",
    url: "https://www.gabbaukraine.com",
    logo: "https://www.gabbaukraine.com/images/logo/gabba-logo.png",
    description:
      "GABBA — український бренд дизайнерських меблів преміум-класу. Колекції Madrid, Luna, Montana, Leora, Moka.",
    foundingDate: "2018",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+380990042222",
      contactType: "customer service",
      availableLanguage: ["Ukrainian", "Russian", "English"],
      areaServed: "UA",
    },
    sameAs: [
      "https://www.instagram.com/gabba.home",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd({
  name,
  city,
  address,
}: {
  name: string;
  city: string;
  address: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: `GABBA — ${city}`,
    description:
      "Шоурум дизайнерських меблів преміум-класу GABBA.",
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressCountry: "UA",
    },
    telephone: "+380990042222",
    url: "https://www.gabbaukraine.com",
    image: "https://www.gabbaukraine.com/images/hero/hero-main.jpg",
    priceRange: "₴₴₴",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "20:00",
    },
    paymentAccepted: "Visa, Mastercard, Apple Pay, Google Pay, Cash",
    currenciesAccepted: "UAH",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GABBA — Luxury Furniture Ukraine",
    alternateName: "Gabba Home",
    url: "https://www.gabbaukraine.com",
    description:
      "Дизайнерські меблі преміум-класу для вашого дому. Безкоштовна доставка по Україні.",
    inLanguage: "uk",
    publisher: {
      "@type": "Organization",
      name: "GABBA",
      logo: {
        "@type": "ImageObject",
        url: "https://www.gabbaukraine.com/images/logo/gabba-logo.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  collection,
  slug,
  inStock = true,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  collection: string;
  slug: string;
  inStock?: boolean;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `https://www.gabbaukraine.com${image}`,
    url: `https://www.gabbaukraine.com/products/${slug}`,
    brand: {
      "@type": "Brand",
      name: "GABBA",
    },
    category: `Дизайнерські меблі / ${collection}`,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "UAH",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: "GABBA",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "UAH",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "UA",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 14,
          },
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
