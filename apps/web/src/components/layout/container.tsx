import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
  as?: React.ElementType;
};

export function Container({
  children,
  className,
  narrow = false,
  as: Tag = "div",
}: Props) {
  return (
    <Tag className={cn(narrow ? "container-narrow" : "container-site", className)}>
      {children}
    </Tag>
  );
}
