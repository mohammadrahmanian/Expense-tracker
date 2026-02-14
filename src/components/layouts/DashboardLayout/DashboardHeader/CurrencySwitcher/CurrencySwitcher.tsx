import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCurrency,
  currencySymbols,
  type Currency,
} from "@/contexts/CurrencyContext";
import { ChevronDown } from "lucide-react";

export const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const currencies: { code: Currency; symbol: string; name: string }[] = [
    { code: "USD", symbol: currencySymbols.USD, name: "US Dollar" },
    { code: "EUR", symbol: currencySymbols.EUR, name: "Euro" },
  ];

  const currentCurrency = currencies.find((c) => c.code === currency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <span className="font-medium">{currentCurrency?.symbol}</span>
          <span className="ml-1 text-xs text-muted-foreground">
            {currentCurrency?.code}
          </span>
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={currency === curr.code ? "bg-accent" : ""}
          >
            <span className="font-medium mr-2">{curr.symbol}</span>
            <span className="text-sm">{curr.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
