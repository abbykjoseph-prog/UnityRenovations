import { getYearsInBusiness } from "@/lib/site";
import { YearsInBusinessClient } from "./YearsInBusinessClient";

/** Number of years in business, e.g. `<YearsInBusiness />+ years`. */
export function YearsInBusiness() {
  return <YearsInBusinessClient initial={getYearsInBusiness()} />;
}
