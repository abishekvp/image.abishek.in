"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { CompressorStudio } from "@/components/CompressorStudio";
import { ConverterStudio } from "@/components/ConverterStudio";
import { ActiveTool } from "@/types";

interface MainStudioProps {
  initialTool?: ActiveTool;
}

export const MainStudio: React.FC<MainStudioProps> = ({ initialTool }) => {
  const pathname = usePathname();
  const isConverter = pathname ? pathname.startsWith("/convert") : initialTool === "converter";

  return isConverter ? <ConverterStudio /> : <CompressorStudio />;
};
