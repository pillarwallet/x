
// Helper: Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
}

// Helper: Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// Derive a key from a PIN using PBKDF2
async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(pin),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000, // Standard high iteration count
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false, // Non-extractable: prevents key extraction via memory dumps
        ["encrypt", "decrypt"]
    );
}

export interface EncryptedData {
    cipherText: string;
    iv: string;
    salt: string;
}

// Encrypt data with a PIN
export async function encryptWithPin(data: string, pin: string): Promise<EncryptedData> {
    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(pin, salt);

    const encodedData = enc.encode(data);
    const cipherBuffer = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    );

    return {
        cipherText: arrayBufferToBase64(cipherBuffer),
        iv: arrayBufferToBase64(iv),
        salt: arrayBufferToBase64(salt),
    };
}

// Decrypt data with a PIN
export async function decryptWithPin(data: EncryptedData, pin: string): Promise<string> {
    const salt = new Uint8Array(base64ToArrayBuffer(data.salt));
    const iv = new Uint8Array(base64ToArrayBuffer(data.iv));
    const cipherBuffer = base64ToArrayBuffer(data.cipherText);

    const key = await deriveKey(pin, salt);

    try {
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            cipherBuffer
        );

        const dec = new TextDecoder();
        return dec.decode(decryptedBuffer);
    } catch (error) {
        throw new Error('Incorrect PIN or corrupted data');
    }
}
