/**
 * Skeleton loading components for gas tank
 */

/**
 * Skeleton row for transaction history loading state
 */
export const SkeletonTransactionRow: React.FC = () => (
  <div className="flex items-center py-3 px-2 gap-4">
    {/* Date skeleton */}
    <div className="flex-[1.5]">
      <div className="h-3 bg-[#25232D] rounded animate-pulse w-24 mb-2" />
      <div className="h-3 bg-[#25232D] rounded animate-pulse w-20" />
    </div>

    {/* Type skeleton */}
    <div className="flex-1">
      <div className="h-4 bg-[#25232D] rounded animate-pulse w-16" />
    </div>

    {/* Amount skeleton */}
    <div className="flex-1">
      <div className="h-4 bg-[#25232D] rounded animate-pulse w-20 ml-auto" />
    </div>

    {/* Token skeleton */}
    <div className="flex-1 flex justify-end gap-2">
      <div className="w-4 h-4 bg-[#25232D] rounded-full animate-pulse flex-shrink-0" />
      <div className="h-4 bg-[#25232D] rounded animate-pulse w-16" />
    </div>
  </div>
);

/**
 * Skeleton balance card
 */
export const SkeletonBalanceCard: React.FC = () => (
  <div className="w-full md:w-[606px] bg-[#1E1D24] rounded-2xl p-8 border border-[#25232D]">
    {/* Header skeleton */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-[#25232D] rounded-full animate-pulse" />
      <div className="h-5 bg-[#25232D] rounded animate-pulse w-40" />
    </div>

    {/* Balance skeleton */}
    <div className="mb-6">
      <div className="h-12 bg-[#25232D] rounded animate-pulse w-48 mb-2" />
      <div className="h-4 bg-[#25232D] rounded animate-pulse w-32" />
    </div>

    {/* Button skeleton */}
    <div className="h-12 bg-[#25232D] rounded-lg animate-pulse mb-4" />

    {/* Total spend skeleton */}
    <div className="h-4 bg-[#25232D] rounded animate-pulse w-40" />
  </div>
);

/**
 * Skeleton history card
 */
export const SkeletonHistoryCard: React.FC = () => (
  <div className="w-full md:w-[606px] bg-[#1E1D24] rounded-2xl p-6 border border-[#25232D]">
    {/* Header skeleton */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-6 h-6 bg-[#25232D] rounded animate-pulse" />
      <div className="h-5 bg-[#25232D] rounded animate-pulse w-40" />
    </div>

    {/* Column headers skeleton */}
    <div className="flex items-center gap-4 pb-3 mb-4 border-b border-[#25232D]">
      <div className="flex-[1.5] h-4 bg-[#25232D] rounded animate-pulse w-20" />
      <div className="flex-1 h-4 bg-[#25232D] rounded animate-pulse w-16" />
      <div className="flex-1 h-4 bg-[#25232D] rounded animate-pulse w-20" />
      <div className="flex-1 h-4 bg-[#25232D] rounded animate-pulse w-16" />
    </div>

    {/* Transaction rows skeleton */}
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <SkeletonTransactionRow key={i} />
      ))}
    </div>
  </div>
);
