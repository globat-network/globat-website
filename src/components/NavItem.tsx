"use client";

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { NavigationLink } from "@/types";

export function NavItem({ link }: { link: NavigationLink }) {
  if (link.pages == null) {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <a href={link.path}>{link.label}</a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[220px] gap-1">
          <li className="grid gap-1">
            {Object.values(link.pages).map((page) => (
              <NavigationMenuLink key={page.path} asChild>
                <a href={page.path}>{page.label}</a>
              </NavigationMenuLink>
            ))}
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
