import { describe, it, expect, vi, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useMediaQuery } from "./use-media-query";

const createMatchMedia = (matches: boolean) => {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];
  const mql = {
    matches,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(
      (_event: string, cb: (event: MediaQueryListEvent) => void) => {
        listeners.push(cb);
      },
    ),
    removeEventListener: vi.fn(
      (_event: string, cb: (event: MediaQueryListEvent) => void) => {
        const index = listeners.indexOf(cb);
        if (index >= 0) listeners.splice(index, 1);
      },
    ),
    dispatchEvent: vi.fn(),
  };
  return { mql, listeners };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useMediaQuery", () => {
  it("returns true when the query matches", () => {
    const { mql } = createMatchMedia(true);
    vi.spyOn(window, "matchMedia").mockReturnValue(
      mql as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));

    expect(result.current).toBe(true);
  });

  it("returns false when the query does not match", () => {
    const { mql } = createMatchMedia(false);
    vi.spyOn(window, "matchMedia").mockReturnValue(
      mql as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));

    expect(result.current).toBe(false);
  });

  it("removes the listener on unmount", () => {
    const { mql } = createMatchMedia(false);
    vi.spyOn(window, "matchMedia").mockReturnValue(
      mql as unknown as MediaQueryList,
    );

    const { unmount } = renderHook(() => useMediaQuery("(min-width: 1024px)"));
    unmount();

    expect(mql.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("re-renders with the new value when the media query changes", () => {
    const { mql, listeners } = createMatchMedia(false);
    vi.spyOn(window, "matchMedia").mockReturnValue(
      mql as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));
    expect(result.current).toBe(false);

    act(() => {
      mql.matches = true;
      listeners.forEach((listener) => listener({} as MediaQueryListEvent));
    });

    expect(result.current).toBe(true);
  });

  it("resubscribes when the query string changes", () => {
    const { mql } = createMatchMedia(false);
    vi.spyOn(window, "matchMedia").mockReturnValue(
      mql as unknown as MediaQueryList,
    );

    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: "(min-width: 1024px)" },
    });
    expect(mql.addEventListener).toHaveBeenCalledTimes(1);

    rerender({ query: "(min-width: 768px)" });

    expect(mql.removeEventListener).toHaveBeenCalledTimes(1);
    expect(mql.addEventListener).toHaveBeenCalledTimes(2);
  });
});
