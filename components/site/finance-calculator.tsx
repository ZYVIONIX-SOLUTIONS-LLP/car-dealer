"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";
import { formatPrice } from "@/lib/utils";

export function FinanceCalculator({ price }: { price: number }) {
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2));
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(60);

  const emi = useMemo(() => {
    const principal = Math.max(price - downPayment, 0);
    const monthlyRate = rate / 12 / 100;
    if (monthlyRate === 0) return principal / tenure;
    const factor = Math.pow(1 + monthlyRate, tenure);
    return (principal * monthlyRate * factor) / (factor - 1);
  }, [price, downPayment, rate, tenure]);

  const principal = Math.max(price - downPayment, 0);
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - principal;

  return (
    <div className="rounded-2xl border border-border bg-card p-6" id="calculator">
      <h3 className="font-display text-lg font-semibold text-foreground">EMI Calculator</h3>
      <div className="mt-5 space-y-5">
        <div>
          <Label htmlFor="downPayment">Down Payment</Label>
          <Input
            id="downPayment"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
          />
          <input
            type="range"
            min={0}
            max={price}
            step={10000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="mt-2 w-full accent-[#ff6a00]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rate">Interest Rate (%)</Label>
            <Input id="rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label htmlFor="tenure">Tenure (months)</Label>
            <Input id="tenure" type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value) || 1)} />
          </div>
        </div>

        <div className="rounded-xl bg-background-secondary p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Estimated Monthly EMI</p>
          <p className="mt-1 font-display text-3xl font-bold text-accent">{formatPrice(Math.round(emi))}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
            <div>
              <p className="text-muted">Principal</p>
              <p className="font-semibold text-foreground">{formatPrice(Math.round(principal))}</p>
            </div>
            <div>
              <p className="text-muted">Total Interest</p>
              <p className="font-semibold text-foreground">{formatPrice(Math.round(totalInterest))}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          This is an estimate for planning purposes only. Actual rates depend on lender and credit profile.
        </p>
      </div>
    </div>
  );
}
