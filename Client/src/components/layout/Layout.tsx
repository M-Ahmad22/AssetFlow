import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        {title && <Header title={title} description={description} />}
        <main className={title ? "p-6" : "p-6 pt-8"}>{children}</main>
      </div>
    </div>
  );
}
