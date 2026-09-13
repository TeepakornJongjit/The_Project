import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  action?: ReactNode;
};

export default function PageHeader({ title, description, eyebrow, action }: PageHeaderProps) {
  return (
    <section className="portal-page-header">
      <div>
        {eyebrow && <p className="portal-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="portal-header-action">{action}</div>}
    </section>
  );
}
