import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

interface ValidationStatusProps {
  status: 'validating' | 'success' | 'error' | 'idle';
  agentAddress?: string;
  balance?: string;
  openPositions?: number;
  errorMessage?: string;
}

export function ValidationStatus({
  status,
  agentAddress,
  balance,
  openPositions,
  errorMessage,
}: ValidationStatusProps) {
  if (status === 'idle') return null;

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {status === 'validating' && (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span>Validating Agent...</span>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Agent Validated Successfully</span>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-4 w-4 text-red-500" />
              <span>Validation Failed</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {status === 'validating' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-muted-foreground">
                Checking Hyperliquid connection...
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-muted-foreground">
                Fetching agent data...
              </span>
            </div>
          </div>
        )}

        {status === 'success' && agentAddress && (
          <div className="space-y-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Connection Successful
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Successfully connected to Hyperliquid and verified agent
                    credentials
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Agent Address
                </p>
                <p className="text-sm font-mono font-semibold">
                  {agentAddress.slice(0, 6)}...{agentAddress.slice(-4)}
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className="text-sm font-semibold text-green-600">
                  ${balance || '0.00'}
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Open Positions
                </p>
                <p className="text-sm font-semibold">{openPositions || 0}</p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="text-sm font-semibold text-green-600">Active</p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                  Validation Error
                </p>
                <p className="text-xs text-muted-foreground">
                  {errorMessage ||
                    'Failed to validate agent. Please check your credentials and try again.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
