import { ethers } from "./ethers.js"
import { abi, contractAddress } from "./constants.js"
    
export function SetElementText(element, text) {
    element.innerText = text;
}

export async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.log(error);
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log(accounts);
        return [true, accounts];
    } else {
        return false
    }
}

export async function balance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        return(ethers.utils.formatEther(balance));
    }
}

export async function fund(etherAmount) {
    const actualEtherAmount = etherAmount.value;
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const txResponse = await contract.fund({ value: ethers.utils.parseEther(actualEtherAmount) });
            await listenForTxMine(txResponse, provider);
        } catch (error) {
            console.log(error)
        }
    }
}

export function listenForTxMine(txResponse, provider) {
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash), (txRecepit) => {
            console.log(`Completed with ${txRecepit.confirmations} number of confirmations!`);
        }
        resolve();
    })
}

export async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const txRes = await contract.withdraw();
            await listenForTxMine(txRes, provider);
        } catch (error) {
            console.log(error);
        }
    }
}