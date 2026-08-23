"use client";

import { useEffect } from "react";

import { ServiceUnavailable } from "@/components/errors/ServiceUnavailable";

export default function Error({
  error,
}: {
  error: Error & {
    digest?: string;
  };
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return <ServiceUnavailable />;
}