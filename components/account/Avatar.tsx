"use client";
import Image from "next/image";
import { useState } from "react";

export default function Avatar({ version, name, size = 48 }: { version?: number; name: string; size?: number }) {
  const [failedVersion, setFailedVersion] = useState<number>();
  const style = { borderRadius: "50%", flexShrink: 0, width: size, height: size };
  if (!version || failedVersion === version) return <span role="img" aria-label={`รูปโปรไฟล์ ${name}`} style={{ ...style, display: "inline-grid", placeItems: "center", background: "#e6f0ff", color: "#2563eb", fontSize: size / 2 }}>{name.trim().charAt(0)}</span>;
  return <Image unoptimized src={`/account/avatar?v=${version}`} alt={`รูปโปรไฟล์ ${name}`} width={size} height={size} style={{ ...style, objectFit: "cover" }} onError={() => setFailedVersion(version)} />;
}
