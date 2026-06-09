import {
  BarChart3,
  BriefcaseBusiness,
  PawPrint,
  Scale,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  tooth: Stethoscope,
  scale: Scale,
  paw: PawPrint,
  chart: BarChart3,
  briefcase: BriefcaseBusiness,
};

export function ProfessionIcon({ icon, size = 22 }: { icon: string; size?: number }) {
  const Icon = icons[icon] ?? BriefcaseBusiness;
  return <Icon size={size} aria-hidden="true" />;
}
