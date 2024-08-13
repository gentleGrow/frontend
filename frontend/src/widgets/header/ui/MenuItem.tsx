import Link from "next/link";
import { Heading } from "@/shared";
import Selected from "./Selected";

export default function MenuItem({ menu }: { menu: Record<string, string> }) {
  return (
    <Link href={menu.href} className="relative">
      <Selected menuHref={menu.href} />
      <Heading
        as="h4"
        fontSize="sm"
        className="hover:text-gray-60 text-gray-100"
      >
        {menu.name}
      </Heading>
    </Link>
  );
}
