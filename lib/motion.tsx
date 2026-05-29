"use client";

/**
 * Hydration-safe framer-motion re-export.
 *
 * motion.* always renders plain HTML — framer never attaches during SSR or
 * hydration, which avoids mobile-only mismatches from whileInView / AnimatePresence.
 * Hooks (useAnimation, etc.) still work for imperative use.
 */
import * as fm from "framer-motion";
import {
  createElement,
  forwardRef,
  type ReactNode,
  type ComponentType,
  type ComponentProps,
} from "react";

const MOTION_PROP_KEYS = new Set([
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "viewport",
  "layout",
  "layoutId",
  "layoutRoot",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "dragPropagation",
  "dragTransition",
  "dragControls",
  "dragListener",
  "dragSnapToOrigin",
  "onDrag",
  "onDragStart",
  "onDragEnd",
  "onDirectionLock",
  "onDragTransitionEnd",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onPan",
  "onPanStart",
  "onPanEnd",
  "onTap",
  "onTapStart",
  "onTapCancel",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "inherit",
  "custom",
  "transformTemplate",
]);

function omitMotionProps(props: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!MOTION_PROP_KEYS.has(key)) {
      result[key] = value;
    }
  }
  return result;
}

const safeComponentCache = new Map<string, ComponentType<any>>();

function createSafeMotionComponent(_MotionComponent: ComponentType<any>, htmlTag: string) {
  const SafeMotion = forwardRef<any, any>(function SafeMotion(props, ref) {
    const { children, ...rest } = props;
    return createElement(
      htmlTag,
      { ...omitMotionProps(rest as Record<string, unknown>), ref },
      children
    );
  });
  SafeMotion.displayName = `SafeMotion(${htmlTag})`;
  return SafeMotion;
}

const rawMotion = fm.motion;

export const motion = new Proxy(rawMotion, {
  get(target, prop: string | symbol) {
    if (typeof prop !== "string") {
      return Reflect.get(target, prop);
    }
    const original = (target as Record<string, unknown>)[prop];
    if (typeof original !== "object" && typeof original !== "function") {
      return original;
    }
    if (!safeComponentCache.has(prop)) {
      safeComponentCache.set(
        prop,
        createSafeMotionComponent(original as ComponentType<any>, prop)
      );
    }
    return safeComponentCache.get(prop);
  },
}) as typeof fm.motion;

/** Passthrough children — no exit animations, no hydration mismatch. */
export function AnimatePresence({ children }: ComponentProps<typeof fm.AnimatePresence>) {
  return <>{children}</>;
}

/** No-op compat wrapper (Providers). */
export function HydratedProvider({ children }: { children: ReactNode }) {
  return children;
}

export const MotionConfig = fm.MotionConfig;
export const useReducedMotion = fm.useReducedMotion;
export const useAnimation = fm.useAnimation;
export const useInView = fm.useInView;
export const useScroll = fm.useScroll;
export const useTransform = fm.useTransform;
export const useMotionValue = fm.useMotionValue;
export const useSpring = fm.useSpring;
export const useMotionTemplate = fm.useMotionTemplate;
export const useVelocity = fm.useVelocity;
export const useWillChange = fm.useWillChange;
export const useAnimate = fm.useAnimate;
export const useDragControls = fm.useDragControls;
export const m = motion;
export const LazyMotion = fm.LazyMotion;
export const domAnimation = fm.domAnimation;
export const domMax = fm.domMax;
