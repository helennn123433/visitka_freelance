export interface BreadcrumbItem {
  label: string;
  to?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
}
