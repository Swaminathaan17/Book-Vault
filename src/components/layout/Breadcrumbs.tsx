import React from 'react';
import { useLocation, Link } from 'wouter';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export function Breadcrumbs() {
  const [location] = useLocation();

  const getBreadcrumbs = () => {
    if (location === '/') return [{ label: 'Home', href: '/' }];
    
    const parts = location.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    parts.forEach((part) => {
      currentPath += `/${part}`;
      const label = part.charAt(0).toUpperCase() + part.slice(1);
      crumbs.push({ label, href: currentPath });
    });
    
    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          
          return (
            <React.Fragment key={crumb.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
