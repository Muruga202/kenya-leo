import { cn } from "@/lib/utils";

interface AdSpaceProps {
  type: "banner" | "sidebar" | "sponsored";
  className?: string;
}

export const AdSpace = ({ type, className }: AdSpaceProps) => {
  const dimensions = {
    banner: "h-24 md:h-32",
    sidebar: "h-64 md:h-96",
    sponsored: "h-48",
  };

  return (
    <div
      className={cn(
        "bg-muted/50 border-2 border-dashed border-border rounded-lg flex items-center justify-center",
        dimensions[type],
        className
      )}
    >
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Advertisement
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {type === "banner" && "728 x 90"}
          {type === "sidebar" && "300 x 600"}
          {type === "sponsored" && "Sponsored Content"}
        </p>
      </div>
    </div>
  );
};
