"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";
import { formatPrice } from "@/lib/utils";

export function LoanCalculator() {
  const [price, setPrice] = useState(1200000);
  const [downPayment, setDownPayment] = useState(240000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(60);

  const { emi, principal, totalInterest } = useMemo(() => {
    const p = Math.max(price - downPayment, 0);
    const monthlyRate = rate / 12 / 100;
    const value =
      monthlyRate === 0
        ? p / tenure
        : (p * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    return { emi: value, principal: p, totalInterest: value * tenure - p };
  }, [price, downPayment, rate, tenure]);

  return (
    <div id="calculator" className="grid gap-8 rounded-3xl border border-border bg-card p-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div>
          <Label htmlFor="lc-price">Vehicle Price</Label>
          <Input id="lc-price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label htmlFor="lc-down">Down Payment</Label>
          <Input
            id="lc-down"
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
            <Label htmlFor="lc-rate">Interest Rate (%)</Label>
            <Input id="lc-rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label htmlFor="lc-tenure">Tenure (months)</Label>
            <Input id="lc-tenure" type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value) || 1)} />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center rounded-2xl bg-background-secondary p-8 text-center">
        <p className="text-xs uppercase tracking-wider text-muted">Estimated Monthly EMI</p>
        <p className="mt-2 font-display text-4xl font-bold text-accent">{formatPrice(Math.round(emi))}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
          <div>
            <p className="text-muted">Loan Amount</p>
            <p className="mt-1 font-semibold text-foreground">{formatPrice(Math.round(principal))}</p>
          </div>
          <div>
            <p className="text-muted">Total Interest</p>
            <p className="mt-1 font-semibold text-foreground">{formatPrice(Math.round(totalInterest))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
