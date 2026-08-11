import { DollarSign, Minus, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileBalanceCardProps {
  balance: string;
  onWithdraw?: () => void;
  onDeposit?: () => void;
}

export function MobileBalanceCard({
  balance,
  onWithdraw,
  onDeposit,
}: MobileBalanceCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Icon and Balance */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
              Available Balance
            </p>
            <p className="text-2xl font-bold text-foreground">${balance}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onWithdraw}
            size="icon"
            className="h-12 w-12 rounded-full bg-muted hover:bg-muted/80 text-foreground"
            variant="ghost"
          >
            <Minus className="h-5 w-5" />
          </Button>
          <Button
            onClick={onDeposit}
            size="icon"
            className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
