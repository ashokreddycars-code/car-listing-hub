import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface Props {
  carPrice: number;
}

const EMICalculator = ({ carPrice }: Props) => {
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2));
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(36);

  const emi = useMemo(() => {
    const principal = carPrice - downPayment;
    if (principal <= 0) return 0;
    const r = rate / 12 / 100;
    if (r === 0) return principal / tenure;
    return (principal * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1);
  }, [carPrice, downPayment, rate, tenure]);

  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - (carPrice - downPayment);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" /> EMI Calculator
      </h3>

      <div className="mt-4 space-y-5">
        <div>
          <Label className="text-sm">Down Payment: ₹{downPayment.toLocaleString("en-IN")}</Label>
          <Slider
            value={[downPayment]}
            min={0}
            max={carPrice}
            step={5000}
            onValueChange={([v]) => setDownPayment(v)}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm">Interest Rate: {rate}%</Label>
          <Slider
            value={[rate]}
            min={5}
            max={18}
            step={0.5}
            onValueChange={([v]) => setRate(v)}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm">Tenure: {tenure} months</Label>
          <Slider
            value={[tenure]}
            min={6}
            max={84}
            step={6}
            onValueChange={([v]) => setTenure(v)}
            className="mt-2"
          />
        </div>

        <div className="rounded-xl hero-gradient p-4 text-center">
          <p className="text-sm text-primary-foreground/80">Estimated Monthly EMI</p>
          <p className="font-heading text-3xl font-bold text-primary-foreground">
            ₹{Math.round(emi).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-primary-foreground/70 mt-1">/month for {tenure} months</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-muted p-3">
            <p className="text-xs text-muted-foreground">Loan Amount</p>
            <p className="font-heading font-bold text-foreground text-sm">₹{(carPrice - downPayment).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <p className="text-xs text-muted-foreground">Total Interest</p>
            <p className="font-heading font-bold text-foreground text-sm">₹{Math.round(totalInterest).toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
