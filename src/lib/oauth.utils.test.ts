import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import {
  buildLoginRedirect,
  getErrorCode,
  getErrorStatus,
  isSafeReturnTo,
} from "./oauth.utils";

describe("isSafeReturnTo", () => {
  it("accepts internal rooted paths", () => {
    expect(isSafeReturnTo("/oauth/consent?request_id=abc")).toBe(true);
    expect(isSafeReturnTo("/dashboard")).toBe(true);
  });

  it("rejects empty / nullish values", () => {
    expect(isSafeReturnTo(null)).toBe(false);
    expect(isSafeReturnTo(undefined)).toBe(false);
    expect(isSafeReturnTo("")).toBe(false);
  });

  it("rejects open-redirect attempts", () => {
    expect(isSafeReturnTo("//evil.com")).toBe(false);
    expect(isSafeReturnTo("http://evil.com")).toBe(false);
    expect(isSafeReturnTo("https://evil.com")).toBe(false);
    expect(isSafeReturnTo("/\\evil.com")).toBe(false);
    expect(isSafeReturnTo("relative/path")).toBe(false);
  });
});

describe("buildLoginRedirect", () => {
  it("encodes the target into a returnTo query param", () => {
    expect(buildLoginRedirect("/oauth/consent?request_id=abc")).toBe(
      "/login?returnTo=%2Foauth%2Fconsent%3Frequest_id%3Dabc",
    );
  });
});

const axiosErrorWith = (status: number, data: unknown): AxiosError => {
  const error = new AxiosError("failed");
  error.response = {
    status,
    data,
    statusText: "",
    headers: {},
    config: {} as never,
  };
  return error;
};

describe("getErrorStatus / getErrorCode", () => {
  it("extracts status and backend error code from axios errors", () => {
    const error = axiosErrorWith(400, { error: "request_expired" });
    expect(getErrorStatus(error)).toBe(400);
    expect(getErrorCode(error)).toBe("request_expired");
  });

  it("returns undefined for non-axios errors", () => {
    const error = new Error("boom");
    expect(getErrorStatus(error)).toBeUndefined();
    expect(getErrorCode(error)).toBeUndefined();
  });
});
