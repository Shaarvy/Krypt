import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider,
        signer,
        transactionContract
    });
}

export const TransactionProvider = ({children}) => {

    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletConnected = async () => {
        try {
            if(!ethereum) return alert("Please Install Metamask");

            const accounts = await ethereum.request({method: 'eth_accounts'});

            if(accounts.length) {
                setCurrentAccount(accounts[0]);
                //getAllTrasactions();
            } else {
                console.log("No accounts found");
            }
        } catch(err) {
            console.log(err);
             throw new Error("No ethereum object.");
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please Install Metamask");
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
            window.location.reload();
        } catch(err) {
            throw new Error("No ethereum object.");
        }
    }

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    return (

        <TransactionContext.Provider value={{ connectWallet, currentAccount }}>
            {children}
        </TransactionContext.Provider>
    )
}