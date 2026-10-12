import { isPlaceholder, site } from "@/lib/site";
import { serviceList } from "@/lib/service-list";

/**
 * GeneralContractor (a LocalBusiness subtype) structured data, built from lib/site.ts.
 * Placeholder values ("[ADD: ...]") are left out automatically until they are filled in.
 */
export function LocalBusinessJsonLd() {
  const { address } = site;
  const postalAddress = {
    "@type": "PostalAddress",
    ...(!isPlaceholder(address.street) && { streetAddress: address.street }),
    ...(!isPlaceholder(address.city) && { addressLocality: address.city }),
    addressRegion: address.region,
    ...(!isPlaceholder(address.postalCode) && { postalCode: address.postalCode }),
    addressCountry: address.country,
  };

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
    telephone: "+1-905-510-5929",
    email: site.email,
    address: postalAddress,
    areaServed: { "@type": "AdministrativeArea", name: site.serviceArea },
    contactPoint: site.contacts.map((c) => ({
      "@type": "ContactPoint",
      name: c.name,
      telephone: c.phoneHref.replace("tel:", ""),
      contactType: "sales",
      areaServed: "CA",
      availableLanguage: "English",
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Renovation and construction services",
      itemListElement: serviceList.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, url: `${site.url}/services#${s.slug}` },
      })),
    },
    ...(site.social.length > 0 && { sameAs: site.social.map((s) => s.href) }),
    ...(!isPlaceholder(site.foundedYear) && { foundingDate: site.foundedYear }),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; "<" is escaped to avoid closing the script tag early
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
