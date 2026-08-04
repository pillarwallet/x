import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

type Status = 'unknown' | 'not-setup' | 'setup';

interface StatusBannerProps {
  status: Status;
  onSetup?: () => void;
  isSettingUp?: boolean;
}

export function StatusBanner({
  status,
  onSetup,
  isSettingUp,
}: StatusBannerProps) {
  const statusConfig = {
    unknown: {
      icon: HelpCircle,
      label: 'Unknown',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      description: 'Connect your wallet to check status',
    },
    'not-setup': {
      icon: AlertCircle,
      label: 'Not Set Up',
      color: 'text-warning',
      bgColor: 'bg-warning/10 border-warning/30',
      description: 'Setup required to use Hyperliquid',
    },
    setup: {
      icon: CheckCircle2,
      label: 'Connected',
      color: 'text-success',
      bgColor: 'bg-success/10 border-success/30',
      description: 'Ready to trade',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('p-4 rounded-lg border', config.bgColor)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={cn('h-5 w-5', config.color)} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Hyperliquid Status:</span>
              <Badge variant="outline" className={config.color}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {config.description}
            </p>
          </div>
        </div>
        {status === 'not-setup' && onSetup && (
          <button
            onClick={onSetup}
            disabled={isSettingUp}
            className="px-4 py-2 text-sm font-medium text-primary-foreground gradient-primary rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSettingUp ? 'Setting up...' : 'Setup Now'}
          </button>
        )}
      </div>
    </div>
  );
}
