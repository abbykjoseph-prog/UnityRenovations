import type { StaticImageData } from "next/image";
import { heroPhotos } from "@/lib/photos";
import powderRoomAfter from "@/public/images/projects/powder-room-after.jpg";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string[];
  includes: string[];
  image: { src: StaticImageData; alt: string };
};

export const services: Service[] = [
  {
    slug: "basement-renovations",
    title: "Basement renovations & finishing",
    shortTitle: "Basement renovations",
    summary: "Turn unused square footage into warm, bright living space that feels like the rest of your home.",
    description: [
      "A finished basement is one of the best ways to add usable space without changing your home's footprint. We plan the layout around how your family actually lives, whether that's a family room, a home office, a guest suite or a space for a growing teenager.",
      "Everything behind the walls is done properly before the finishes go on, so the space stays comfortable, quiet and dry for years.",
    ],
    includes: [
      "Layout planning for family rooms, bedrooms, offices and guest suites",
      "Framing, insulation and vapour barrier",
      "Drywall, ceilings and pot lighting",
      "Basement bathrooms and wet bars",
      "Flooring, trim and finish carpentry",
      "Coordination of electrical and plumbing rough-ins",
    ],
    image: heroPhotos.basementFraming,
  },
  {
    slug: "kitchen-remodels",
    title: "Kitchen remodels",
    shortTitle: "Kitchen remodels",
    summary: "Custom cabinetry, countertops and layouts that make the heart of your home work harder and look better.",
    description: [
      "From a refresh of cabinets and counters to a full tear-out with a new island and layout, we build kitchens that are as practical as they are beautiful.",
      "We protect the rest of your home while we work, keep you up to date on schedule and selections, and sweat the details, from the reveal on a cabinet door to the fit of an undermount sink.",
    ],
    includes: [
      "Full tear-out with dust and floor protection",
      "Custom cabinetry and islands",
      "Countertops, backsplashes and undermount sinks",
      "Layout changes and lighting",
      "Flooring and finishing trim",
      "Appliance installation coordination",
    ],
    image: heroPhotos.kitchenNavyIsland,
  },
  {
    slug: "bathroom-remodels",
    title: "Bathroom remodels",
    shortTitle: "Bathroom remodels",
    summary: "Ensuites, main baths and powder rooms finished with clean lines and tile work that lasts.",
    description: [
      "Bathrooms have to stand up to water, steam and everyday use, so there's no room for shortcuts. We build them properly from the studs out, then finish them with the tile, fixtures and details you've chosen.",
      "Whether it's a quick powder room update or a full ensuite, you'll get the same careful workmanship.",
    ],
    includes: [
      "Full gut renovations or targeted refits",
      "Showers, tubs and waterproofing",
      "Tile work, including feature walls such as 3D tile",
      "Vanities, fixtures and fittings",
      "Powder rooms and ensuites",
      "Lighting, ventilation and finishing",
    ],
    image: { src: powderRoomAfter, alt: "Renovated powder room with a vessel sink vanity and white tile floor" },
  },
  {
    slug: "whole-home-renovations",
    title: "Whole-home renovations",
    shortTitle: "Whole-home renovations",
    summary: "Open up layouts, upgrade finishes and bring every room up to the same high standard.",
    description: [
      "A whole-home renovation lets you rethink how the house flows: removing walls to open up a main floor, adding architectural detail, and carrying one consistent level of finish from room to room.",
      "With one team managing the whole project, you get one schedule, one budget and one point of contact.",
    ],
    includes: [
      "Open-concept conversions, including load-bearing wall removal",
      "Wainscoting, panel moulding and finish carpentry",
      "Coffered and feature ceilings",
      "Window and door trim",
      "Subfloor and flooring upgrades",
      "New interior walls and room divisions",
    ],
    image: heroPhotos.livingRoomPanelMoulding,
  },
  {
    slug: "additions",
    title: "Additions & extensions",
    shortTitle: "Additions & extensions",
    summary: "More room for your family without leaving the neighbourhood you love.",
    description: [
      "When you need more space, an addition can be the best of both worlds: you keep your location and gain the square footage you need. We design additions to tie seamlessly into the existing home, inside and out.",
      "From second-storey additions to balconies, decks and covered outdoor spaces, we handle the structure and the finishes.",
    ],
    includes: [
      "Second-storey and rear additions",
      "Balconies, decks and covered outdoor spaces",
      "Exterior cladding, including cedar",
      "Seamless tie-in to the existing structure and finishes",
      "Fencing, gates and outdoor carpentry",
    ],
    image: heroPhotos.cedarSecondStoreyAddition,
  },
  {
    slug: "rebuilds",
    title: "Rebuilds",
    shortTitle: "Rebuilds",
    summary: "When a cosmetic refresh won't cut it, we take the space back to the structure and rebuild it right.",
    description: [
      "Some spaces need more than new finishes. Whether it's an outdated layout, past damage or work that wasn't done properly the first time, we take it back to the framing and rebuild it to a standard you can trust.",
      "You get a space that's built correctly behind the walls as well as in front of them.",
    ],
    includes: [
      "Selective or full interior demolition",
      "Structural framing and reinforcement",
      "New mechanical rough-ins coordinated with trades",
      "Insulation, drywall and finishes",
      "Reworked layouts designed around how you live",
    ],
    image: heroPhotos.interiorFraming,
  },
  {
    slug: "custom-homes",
    title: "Custom home builds: from the foundation up",
    shortTitle: "Custom home builds",
    summary: "A home built around your plans and your lifestyle, from the foundation to the final finishes.",
    description: [
      "Building a custom home is a big decision, and it deserves a builder who treats it that way. We work with you from the earliest planning conversations through the foundation, framing and building envelope, all the way to the finishing details.",
      "You'll have a single point of contact, a clear budget and a realistic schedule from day one.",
    ],
    includes: [
      "Planning around your lot, budget and lifestyle",
      "Foundation, framing and building envelope",
      "Coordination of every trade through to final finishes",
      "Custom millwork and architectural details",
      "One point of contact from first meeting to handover",
    ],
    image: heroPhotos.cedarGableCanopy,
  },
];
