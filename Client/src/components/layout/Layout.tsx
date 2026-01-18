// import { ReactNode } from "react";
// import { Sidebar } from "./Sidebar";
// import { Header } from "./Header";

// interface LayoutProps {
//   children: ReactNode;
//   title?: string;
//   description?: string;
// }

// export function Layout({ children, title, description }: LayoutProps) {
//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar />
//       <div className="ml-64">
//         {title && <Header title={title} description={description} />}
//         <main className={title ? "p-6" : "p-6 pt-8"}>{children}</main>
//       </div>
//     </div>
//   );
// }

import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1000) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        {title && (
          <Header
            title={title}
            description={description}
            onMenuClick={() => setSidebarOpen(true)}
          />
        )}
        <main className={title ? "p-6" : "p-6 pt-8"}>{children}</main>
      </div>
    </div>
  );
}
