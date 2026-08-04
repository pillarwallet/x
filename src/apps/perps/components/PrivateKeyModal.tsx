import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Copy, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface PrivateKeyModalProps {
    isOpen: boolean;
    address: string;
    privateKey: string;
    onClose: () => void;
    mode?: 'created' | 'revealed';
    mainAddress?: string; // EOA Address
}

export function PrivateKeyModal({
    isOpen,
    address,
    privateKey,
    onClose,
    mode = 'created',
    mainAddress,
}: PrivateKeyModalProps) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(privateKey);
            setCopied(true);
            toast.success('Private key copied to clipboard');

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                setCopied(false);
                timerRef.current = null;
            }, 2000);
        } catch (error) {
            toast.error('Failed to copy private key');
        }
    };

    const handleDownload = () => {
        let url = '';
        let a: HTMLAnchorElement | null = null;

        try {
            // Validation
            if (!address || !privateKey) {
                throw new Error('Missing wallet data');
            }

            const data = JSON.stringify(
                {
                    address,
                    privateKey,
                    createdAt: new Date().toISOString(),
                    note: "KEEP THIS SAFE. DO NOT SHARE."
                },
                null,
                2
            );

            const blob = new Blob([data], { type: 'application/json' });
            url = URL.createObjectURL(blob);
            a = document.createElement('a');
            a.href = url;
            a.download = `agent-wallet-${address.slice(0, 8)}.json`;
            document.body.appendChild(a);
            a.click();
            toast.success('Key file downloaded');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to download key file');
        } finally {
            // Cleanup
            if (a) {
                document.body.removeChild(a);
            }
            if (url) {
                URL.revokeObjectURL(url);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {mode === 'created' ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-success" />
                                Wallet Secured Successfully
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="h-5 w-5 text-warning" />
                                Private Key Revealed
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'created'
                            ? "Your agent wallet can perform actions on behalf of your account without having withdrawal permissions. You must still use your account's address to withdraw"
                            : "Be careful! Anyone with this key can access your funds."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Main Wallet Address</Label>
                        <div className="flex gap-2">
                            <div className="text-sm font-mono bg-muted p-2 rounded break-all flex-1">
                                {mainAddress || address}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                onClick={() => {
                                    navigator.clipboard.writeText(mainAddress || address);
                                    toast.success('Address copied');
                                }}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Private Key</Label>
                        <div className="relative">
                            <Input
                                value={privateKey}
                                readOnly
                                className="font-mono pr-10 text-xs"
                                type="text"
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            This private key can be used to trade on any device. Simply import it.
                        </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button onClick={handleCopy} className="flex-1" variant="outline">
                            {copied ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            {copied ? 'Copied' : 'Copy Key'}
                        </Button>
                        <Button onClick={handleDownload} className="flex-1" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </div>

                    <Button onClick={onClose} className="w-full mt-2">
                        I have saved my key
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
