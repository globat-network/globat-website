"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { NavigationLink } from "@/types";

export function MobileNav({ links }: { links: NavigationLink[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((open) => !open)}
        className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border p-2 transition focus-visible:ring-[3px] focus-visible:outline-none"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-border bg-background mt-4 w-full rounded-xl border p-3 shadow-sm"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li
                key={link.path}
                className="border-border/60 border-b pb-2 last:border-b-0"
              >
                <a
                  href={link.path}
                  className="text-foreground hover:bg-accent hover:text-accent-foreground flex min-h-11 items-center rounded-md px-3 text-base font-medium transition"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>

                {link.pages && (
                  <ul className="mt-1 space-y-1 px-3 pb-1">
                    {Object.values(link.pages).map((page) => (
                      <li key={page.path}>
                        <a
                          href={page.path}
                          className="text-foreground/75 hover:bg-accent hover:text-accent-foreground flex min-h-10 items-center rounded-md px-3 text-sm transition"
                          onClick={() => setIsOpen(false)}
                        >
                          {page.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
