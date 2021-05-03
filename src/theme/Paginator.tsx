import React from "react";
import Link from "@docusaurus/Link";

export default function Paginator(props: any) {
  return (
    <nav className="grid gap-4 grid-cols-2 print:hidden w-full" {...props} />
  );
}

Paginator.PrevItem = (props: any) => <div className="flex span-1" {...props} />;

Paginator.NextItem = (props: any) => (
  <div className="flex col-start-2 text-right" {...props} />
);

Paginator.Link = ({ subtitle, title, to }: any) => {
  return (
    <Link
      to={to}
      className="border border-emphasis-300 rounded-lg flex-grow leading-relaxed p-4 transition-colors hover:border-primary hover:no-underline"
    >
      <div className="mb-1 text-gray-400 text-sm">{subtitle}</div>
      <div className="font-semibold break-words text-primary">{title}</div>
    </Link>
  );
};
