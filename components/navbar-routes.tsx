"use client";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const pathName = usePathname();
  const router = useRouter();
  const isTeacherPage = pathName?.startsWith("/teacher");
  const isPlayerPage = pathName?.startsWith("/courses");
  const isSearchPage = pathName === "/search";
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput></SearchInput>
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button size={"sm"} variant={"ghost"}>
              <LogOut className="h-4 w-4 mr-2"></LogOut>退出
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button size={"sm"} variant={"ghost"}>
              教师模式
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/"></UserButton>
      </div>
    </>
  );
};
