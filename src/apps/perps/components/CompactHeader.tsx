import { Card } from './ui/card';
import { Button } from './ui/button';
import { Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

interface CompactHeaderProps {
  accountAddress: string;
  balance: string;
  onViewKey: () => void;
  onRemove: () => void;
  isConnected: boolean;
}

export function CompactHeader({
  accountAddress,
  balance,
  onViewKey,
  onRemove,
  isConnected,
}: CompactHeaderProps) {
  return (
    <Card className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">
                {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">
                Not connected
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isConnected && (
            <span className="text-sm font-semibold">${balance}</span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewKey}>
                View Private Key
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onRemove} className="text-destructive">
                Remove Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
