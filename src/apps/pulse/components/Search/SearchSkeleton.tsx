import React from 'react';

interface SearchSkeletonProps {
    showSections?: boolean;
}

export default function SearchSkeleton({ showSections = true }: SearchSkeletonProps) {
    return (
        <div className="w-full px-2.5 animate-pulse">
            {/* Section Headers */}
            {showSections && (
                <>
                    <div className="h-4 bg-[#2A2A2A] rounded w-32 mb-4 mt-4" />
                    <div className="h-4 bg-[#2A2A2A] rounded w-24 mb-4" />
                </>
            )}

            {/* Skeleton Rows */}
            {Array.from({ length: 10 }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between py-3"
                >
                    {/* Left side: Avatar + Text */}
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 bg-[#2A2A2A] rounded-full" />

                        {/* Text lines */}
                        <div className="flex flex-col gap-2">
                            <div className="h-3 bg-[#2A2A2A] rounded w-24" />
                            <div className="h-3 bg-[#2A2A2A] rounded w-32" />
                        </div>
                    </div>

                    {/* Right side: Value bars */}
                    <div className="flex flex-col gap-2 items-end">
                        <div className="h-3 bg-[#2A2A2A] rounded w-20" />
                        <div className="h-3 bg-[#2A2A2A] rounded w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}
