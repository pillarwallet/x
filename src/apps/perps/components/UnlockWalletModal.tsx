import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from './ui/input-otp';

interface UnlockWalletModalProps {
    isOpen: boolean;
    onUnlock: (pin: string) => Promise<boolean>;
    onClose: () => void;
}

export function UnlockWalletModal({ isOpen, onUnlock, onClose }: UnlockWalletModalProps) {
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset PIN when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setPin('');
            setIsLoading(false);
        } else {
            // Auto-focus the input when modal opens
            // Attempt 1: Fast (for desktop/fast devices)
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);

            // Attempt 2: Slower (for mobile animations to finish)
            setTimeout(() => {
                inputRef.current?.focus();
            }, 500);
        }
    }, [isOpen]);

    const handleUnlockAttempt = useCallback(async (pinValue: string) => {
        if (pinValue.length !== 4) return;

        setIsLoading(true);
        try {
            const success = await onUnlock(pinValue);
            if (success) {
                toast.success('Wallet unlocked!');
                setPin(''); // Clear PIN on success
            } else {
                // Handle explicit failure (false returned)
                toast.error('Incorrect PIN');
                setPin('');
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            }
        } catch (error) {
            console.error('Unlock failed', error);
            toast.error('Incorrect PIN');
            setPin(''); // Clear PIN on failure to allow retry
            // Refocus input on failure
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } finally {
            setIsLoading(false);
        }
    }, [onUnlock]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleUnlockAttempt(pin);
    };

    // Auto-submit when PIN is complete
    useEffect(() => {
        if (pin.length === 4 && !isLoading) {
            handleUnlockAttempt(pin);
        }
    }, [pin, handleUnlockAttempt, isLoading]);

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center gap-2 text-center">
                        <Lock className="h-5 w-5" />
                        Unlock Agent Wallet
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Enter your PIN to unlock your trading agent.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2 flex flex-col items-center">
                        <Label htmlFor="pin" className="w-full text-center">PIN Code</Label>
                        <InputOTP
                            ref={inputRef}
                            maxLength={4}
                            value={pin}
                            onChange={(value) => setPin(value)}
                            disabled={isLoading}
                            autoFocus
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} masked />
                                <InputOTPSlot index={1} masked />
                                <InputOTPSlot index={2} masked />
                                <InputOTPSlot index={3} masked />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={isLoading || pin.length !== 4} className="w-full">
                            {isLoading ? 'Unlocking...' : 'Unlock'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
