import { type FC } from "react";
import { RecurringDetailHeroDesktop } from "./RecurringDetailHeroDesktop";
import { RecurringDetailHeroMobile } from "./RecurringDetailHeroMobile";
import type { Category, RecurringStatus, RecurringTransaction } from "@/types";

type RecurringDetailHeroProps = {
  transaction: RecurringTransaction;
  category: Category | undefined;
  status: RecurringStatus;
  formatAmount: (n: number) => string;
};

export const RecurringDetailHero: FC<RecurringDetailHeroProps> = (props) => (
  <>
    <RecurringDetailHeroMobile {...props} />
    <RecurringDetailHeroDesktop {...props} />
  </>
);
