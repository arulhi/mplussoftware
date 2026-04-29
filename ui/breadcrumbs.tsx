import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { menus } from "@/constant/data";

const Breadcrumbs = () => {
  const location = usePathname();
  const locationName = location?.replace("/", "").replace(/-/g, " ");

  const [isHide, setIsHide] = useState(null);
  const [groupTitle, setGroupTitle] = useState("");

  useEffect(() => {
    let foundItem: any = null;
    let foundGroup = null;
    
    menus.forEach((menu) => {
      menu.items.forEach((item) => {
        if (item.title.toLowerCase() === locationName?.toLowerCase()) {
          foundItem = item;
        }
        if (item.child) {
          item.child.forEach((child) => {
            if (child.title.toLowerCase() === locationName?.toLowerCase()) {
              foundItem = child;
              foundGroup = item.title;
            }
          });
        }
      });
    });

    if (foundItem) {
      setIsHide(foundItem.isHide || false);
      setGroupTitle(foundGroup || "");
    }
  }, [location, locationName]);

  return (
    !isHide && (
      <div className="md:mb-0 mb-2 flex space-x-3 rtl:space-x-reverse">
        <ul className="flex text-sm space-x-2 items-center">
          <li className="relative flex items-center space-x-2 capitalize font-normal rtl:space-x-reverse text-primary-500">
            <Link href="/dashboard" className="text-xs text-muted-foreground">
              Pages
            </Link>
            <span className="text-xs text-secondary-500 dark:text-slate-500 rtl:transform rtl:rotate-180">
              /
            </span>
          </li>
          {groupTitle && (
            <li className="relative flex items-center space-x-2 capitalize font-normal rtl:space-x-reverse text-primary-500">
              <button type="button" className="capitalize">
                {groupTitle}
              </button>
              <span className="text-xs text-secondary-500 dark:text-slate-500 rtl:transform rtl:rotate-180">
                /
              </span>
            </li>
          )}
          <li className="relative flex items-center space-x-2 capitalize font-normal text-xs rtl:space-x-reverse text-slate-500 dark:text-slate-400">
            {locationName?.replace(/\/?\d+/g, "").replace(/-/g, " ")}
          </li>
        </ul>
      </div>
    )
  );
};

export default Breadcrumbs;
