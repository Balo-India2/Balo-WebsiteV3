import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
};

export function LazyImage({ wrapperClassName, className, onLoad, alt = "", ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative w-full h-full", wrapperClassName)}>
      {!loaded && <Skeleton className="absolute inset-0 size-full rounded-[inherit]" />}
      <img
        {...rest}
        alt={alt}
        loading={rest.loading ?? "lazy"}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </div>
  );
}
