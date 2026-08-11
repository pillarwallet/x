import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet, LogOut, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';

export function ConnectButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    const isArbitrum = chain?.id === 42161;

    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-sm font-mono text-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {chain?.name || 'Unknown Network'}
            </span>
            {!isArbitrum && (
              <Badge
                variant="destructive"
                className="text-xs flex items-center gap-1"
              >
                <AlertTriangle className="h-3 w-3" />
                Switch to Arbitrum
              </Badge>
            )}
          </div>
        </div>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="gap-2"
        >
          <Wallet className="h-4 w-4" />
          {isPending ? 'Connecting...' : `Connect ${connector.name}`}
        </Button>
      ))}
    </div>
  );
}
