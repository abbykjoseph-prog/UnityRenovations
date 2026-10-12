import { site } from "@/lib/site";
import { serviceList } from "@/lib/service-list";

/**
 * GeneralContractor (a LocalBusiness subtype) structured data, built from lib/site.ts.
 * Unity Renovations is a service-area business with no office, so no address is published.
 */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${site.url}/#business`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: `${site.url}/images/logo.png`,
    image: `${site.url}/og-image.jpg`,
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    foundingDate: String(site.foundedYear),
    founder: { "@type": "Person", name: site.founder },
    areaServed: site.serviceCities.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "AdministrativeArea", name: "Ontario, Canada" },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Renovation and construction services",
      itemListElement: serviceList.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, url: `${site.url}/services#${s.slug}` },
      })),
    },
    sameAs: [site.instagram.href],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; "<" is escaped to avoid closing the script tag early
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
