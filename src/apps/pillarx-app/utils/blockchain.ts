export const getAllUniqueBlockchains = (blockchainsList: string []) => {
    // eslint-disable-next-line prefer-const    
    let uniqueBlockchains: string[] = [];
    if (blockchainsList) {
        blockchainsList.forEach(chain => {
            if (!uniqueBlockchains.includes(chain)) {
                uniqueBlockchains.push(chain);
            }
        });
    }
    return uniqueBlockchains;
}
