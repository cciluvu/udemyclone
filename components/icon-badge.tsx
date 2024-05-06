import { Icon, LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bgVariant = cva("rounded-full flex item-center justify-center", {
  variants: {
    variant: {
      default: "bg-sky-100",
      success: "bg-emerald-100",
    },
    iconVariant: {
      default: "bg-sky-100",
      success: "bg-emerald-100",
    },
    size: { default: "p-2", sm: "p-1" },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
});

const iconVariant = cva("", {
  variants: {
    variant: {
      default: "text-sky-700",
      success: "text-emerald-700",
    },
    size: {
      default: "w-8 h-8",
      sm: "w-4 h-4",
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
});

type BackGroundVariantProps = VariantProps<typeof bgVariant>;
type IconVariantProps = VariantProps<typeof iconVariant>;

interface IconBadgeProps extends BackGroundVariantProps, IconVariantProps {
  icon: LucideIcon;
}

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
  return (
    <div className={cn(bgVariant({ variant, size }))}>
      <Icon className={cn(iconVariant({ variant, size }))} />
    </div>
  );
};
