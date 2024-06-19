
/* eslint-disable no-console */
/**
 * Copyright 2024 Kieran Goodary <kieran@digitalindustria.com>
 *
 * Permission is hereby granted, free of charge, to any 
 * person obtaining a copy of this software and associated 
 * documentation files (the “Software”), to deal in the 
 * Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit 
 * persons to whom the Software is furnished to do so, subject
 * to the following conditions:
 *
 * The above copyright notice and this permission notice shall 
 * be included in all copies or substantial portions of the 
 * Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * ⚠️ BUT WAIT!!! A note about this code snippet:
 *
 * The core principles of this Gist is to take the shortest
 * malleable route to be able to create a Mnemonic phrase
 * via the Ethers library. DO NOT take this code snippet as
 * secure out-of-the-box or tested in any way. It's designed
 * to be worked to your liking / business process with several
 * points where the one-way cryptography can be strengthened.
 *
 * May the force be with you.
 * Kio ❤️
 */
import { Buffer as ImportedBuffer } from 'buffer';
import { entropyToMnemonic } from 'ethers/lib/utils';
if (typeof window !== 'undefined') window.Buffer = window.Buffer ?? ImportedBuffer;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const convertStringToMnemonic = (arbitraryUserId) => {
    // This would be the Firebase User ID, but it could indeed be anything
    // const arbitraryUserId = 'somearbstring123';

    // Use "Password-Based Key Derivation Function 2" to create a 
    // one-way buffer based on the "ID" above.
    // Notes: 
    // - Salt is set to 123 as an example, should be something bigger
    // - Iterations is set to 1 as an example, should be MUCH higher
    // - key length set to 1024
    // - HMAC digest set to SHA512. SHA512 is considered a bit overkill
    // const hash = pbkdf2Sync(arbitraryUserId, 'iamasalt', 1, 1024, 'sha512');
    // const hash = window.Buffer.from(arbitraryUserId, 'utf8');

    // Generate Mnemonic
    // Now can create a mnemonic BIP-39
    // sequence of words based from the initial hash generated
    // Notes:
    // - entropyToPhrase requires a 32 byte entropy. Taking the
    //.  hash buffer and slicing the first 32 bytes but you could
    //   move this 32 byte slide anywhere within the 1024 frame
    let utf8Encode = new TextEncoder();
    const uInt8Arr = utf8Encode.encode('asdasdasdasdasdasdasdasdasdasdas');
    const mnemonicPhrase = entropyToMnemonic(uInt8Arr);

    console.log(`Mnemonic Phrase: ${mnemonicPhrase}`);

    return mnemonicPhrase;
}