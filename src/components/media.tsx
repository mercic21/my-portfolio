import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Fills its (relatively positioned) parent. Cloudinary goes through next/image, other hosts don't. */
export function Media({ src, alt, sizes, className, priority }: Props) {
  if (src.startsWith("https://res.cloudinary.com/")) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary hosts aren't allowed through the optimizer
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
