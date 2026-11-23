import type { InfiniteData } from "@tanstack/react-query";
import { Transaction } from "@/types";

export type PageData = { items: Transaction[]; total: number; count: number };

export type MobileInfiniteData = InfiniteData<PageData> | undefined;
