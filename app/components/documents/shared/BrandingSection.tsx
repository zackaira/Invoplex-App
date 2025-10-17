"use client";

import Image from "next/image";
import Link from "next/link";

export function BrandingSection() {
  return (
    <div className="flex-shrink-0">
      <div className="text-xs text-gray-400 mb-1">Powered by</div>
      <Link href="https://kaira.co/" target="_blank">
        <Image
          src="/invoplex-logo.png"
          alt="Invoplex Logo"
          width={160}
          height={45}
          className="object-contain"
        />
      </Link>
    </div>
  );
}
