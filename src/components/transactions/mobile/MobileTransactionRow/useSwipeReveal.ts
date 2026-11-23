import { useCallback, useEffect, useRef } from "react";
import { animate, useMotionValue, type PanInfo } from "framer-motion";
import { SWIPE_ACTIONS_WIDTH } from "./MobileTransactionRow.utils";

/** Horizontal release velocity (px/s) that snaps the row regardless of position. */
const SNAP_VELOCITY = 400;
const SNAP_TRANSITION = {
  type: "spring",
  stiffness: 500,
  damping: 45,
} as const;

type UseSwipeRevealParams = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useSwipeReveal = ({
  isOpen,
  onOpenChange,
}: UseSwipeRevealParams) => {
  const x = useMotionValue(0);
  const wasDraggedRef = useRef(false);

  const snapTo = useCallback(
    (open: boolean) => {
      const target = open ? -SWIPE_ACTIONS_WIDTH : 0;
      if (x.get() === target && !x.isAnimating()) return;
      animate(x, target, SNAP_TRANSITION);
    },
    [x],
  );

  useEffect(() => {
    snapTo(isOpen);
  }, [isOpen, snapTo]);

  const close = useCallback(() => {
    snapTo(false);
    onOpenChange(false);
  }, [snapTo, onOpenChange]);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const velocity = info.velocity.x;
    const open =
      velocity < -SNAP_VELOCITY ||
      (velocity <= SNAP_VELOCITY && x.get() < -SWIPE_ACTIONS_WIDTH / 2);
    snapTo(open);
    if (open !== isOpen) onOpenChange(open);
  };

  // framer-motion stops the running snap animation on pointer down. When the
  // pointer session ends without a drag, settle the row at its current state.
  const handlePointerEnd = () => {
    if (!wasDraggedRef.current) snapTo(isOpen);
  };

  const handleClick = () => {
    if (wasDraggedRef.current) return;
    if (isOpen) close();
  };

  const motionProps = {
    drag: "x" as const,
    dragConstraints: { left: -SWIPE_ACTIONS_WIDTH, right: 0 },
    dragElastic: 0.1,
    dragDirectionLock: true,
    dragMomentum: false,
    style: { x },
    onPointerDown: () => {
      wasDraggedRef.current = false;
    },
    onDragStart: () => {
      wasDraggedRef.current = true;
    },
    onPointerUp: handlePointerEnd,
    onPointerCancel: handlePointerEnd,
    onDragEnd: handleDragEnd,
    onClick: handleClick,
  };

  return { motionProps, close };
};
