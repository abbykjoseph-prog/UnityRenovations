import { site } from "@/lib/site";
import { InstagramIcon } from "@/components/ui/Icons";

type Props = {
  /** Show the @handle next to the icon */
  showHandle?: boolean;
  className?: string;
  iconClassName?: string;
};

export function InstagramLink({ showHandle = false, className = "", iconClassName = "" }: Props) {
  return (
    <a
      href={site.instagram.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={showHandle ? undefined : `${site.name} on Instagram (opens in a new tab)`}
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <InstagramIcon className={iconClassName} />
      {showHandle && (
        <span>
          {site.instagram.handle}
          <span className="sr-only"> on Instagram (opens in a new tab)</span>
        </span>
      )}
    </a>
  );
}
