"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import {
  getLightboxCarousel,
  LIGHTBOX_CONTROLLER,
  LIGHTBOX_STYLES,
  toLightboxSlides,
  type LightboxPhoto,
} from "@/components/lightbox-config";
import { createLightboxRender } from "@/components/lightbox-render";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
  loading: () => null,
});

export type SiteLightboxProps = {
  open: boolean;
  close: () => void;
  index: number;
  slides: LightboxPhoto[];
  onView?: (index: number) => void;
};

export function useLightboxStyles() {
  useEffect(() => {
    void import("yet-another-react-lightbox/styles.css");
  }, []);
}

export default function SiteLightbox({
  open,
  close,
  index,
  slides,
  onView,
}: SiteLightboxProps) {
  useLightboxStyles();

  if (!open || slides.length === 0) return null;

  const count = slides.length;

  return (
    <Lightbox
      className="site-lightbox"
      open={open}
      close={close}
      index={index}
      slides={toLightboxSlides(slides)}
      carousel={getLightboxCarousel(count)}
      controller={LIGHTBOX_CONTROLLER}
      styles={LIGHTBOX_STYLES}
      on={onView ? { view: ({ index: i }) => onView(i) } : undefined}
      render={createLightboxRender(count)}
    />
  );
}
