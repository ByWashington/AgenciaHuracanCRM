import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import ThemeSwitcher from "./theme-switcher";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: { userId },
  });

  if (!stores) {
    redirect("/");
  }

  return (
    <div className="border-b">
      <div className="flex h-16 justify-between items-center px-4 gap-5">
        <StoreSwitcher className="w-52" items={stores} />
        <MainNav className="mx-6 w-full justify-end lg:justify-center" />
        <div className="lg:w-52 flex justify-end space-x-4">
          <ThemeSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
