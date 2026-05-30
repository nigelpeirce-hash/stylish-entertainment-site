"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Render } from "yet-another-react-lightbox";

/** Site-wide: hide prev/next icons for a single slide; show for multi-image galleries. */
export function createLightboxRender(slideCount: number): Render {
  if (slideCount <= 1) {
    return {
      buttonPrev: () => null,
      buttonNext: () => null,
    };
  }

  const iconSize = 32;
  const strokeWidth = 2.5;

  return {
    iconPrev: () => (
      <ChevronLeft size={iconSize} strokeWidth={strokeWidth} aria-hidden />
    ),
    iconNext: () => (
      <ChevronRight size={iconSize} strokeWidth={strokeWidth} aria-hidden />
    ),
  };
}
