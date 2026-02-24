import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

const Section = ({ id, className, children }: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        "w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24",
        className
      )}
    >
      {children}
    </section>
  );
};

export default Section;
