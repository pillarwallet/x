// Types
import { TransactionStatus as TxStatus } from '../types';

// Utils
import { getBlockExplorerUrl, shortenAddress } from '../utils/blockchain';

interface TransactionStatusProps {
  transactions: TxStatus[];
  onClear: (hash: string) => void;
}

const TransactionStatus = ({
  transactions,
  onClear,
}: TransactionStatusProps) => {
  if (transactions.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        Recent Transactions
      </h2>
      <div className="space-y-3">
        {transactions.map((tx) => {
          const explorerUrl = getBlockExplorerUrl(tx.chainId, tx.hash);
          const statusColor =
            tx.status === 'success'
              ? 'text-green-400'
              : tx.status === 'failed'
                ? 'text-red-400'
                : 'text-yellow-400';
          const statusIcon =
            tx.status === 'success' ? '✓' : tx.status === 'failed' ? '✗' : '⏳';

          return (
            <div
              key={tx.hash}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg ${statusColor}`}>
                      {statusIcon}
                    </span>
                    <span className={`text-sm font-medium ${statusColor}`}>
                      {tx.status === 'pending'
                        ? 'Transaction Pending'
                        : tx.status === 'success'
                          ? 'Transaction Confirmed'
                          : 'Transaction Failed'}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 font-mono break-all">
                    {shortenAddress(tx.hash, 8)}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {explorerUrl && (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-purple_medium hover:bg-purple_medium/50 rounded-lg text-xs font-medium transition-colors"
                    >
                      View
                    </a>
                  )}
                  <button
                    onClick={() => onClear(tx.hash)}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionStatus;

