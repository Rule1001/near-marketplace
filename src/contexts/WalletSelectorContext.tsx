import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {map, distinctUntilChanged} from "rxjs";
import {setupWalletSelector} from "@near-wallet-selector/core";
import type {WalletSelector, AccountState} from "@near-wallet-selector/core";
import {setupModal} from "@near-wallet-selector/modal-ui";
import type {WalletSelectorModal} from "@near-wallet-selector/modal-ui";
import {setupNearWallet} from "@near-wallet-selector/near-wallet";
import {setupMyNearWallet} from "@near-wallet-selector/my-near-wallet";
import {setupSender} from "@near-wallet-selector/sender";
import {setupMathWallet} from "@near-wallet-selector/math-wallet";
import {setupNightly} from "@near-wallet-selector/nightly";
// import { setupLedger } from "@near-wallet-selector/ledger";
import {setupWalletConnect} from "@near-wallet-selector/wallet-connect";
import {setupNightlyConnect} from "@near-wallet-selector/nightly-connect";
import environment from "../utils/config";

const nearEnv = environment("testnet");
import senderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";
import nightlyConnectIconUrl from "@near-wallet-selector/nightly-connect/assets/nightly-connect.png";
import mathIconUrl from "@near-wallet-selector/math-wallet/assets/math-wallet-icon.png";
import myNearWalletConnectIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png"
import nearWalletConnectIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png"
import walletConnectIconUrl from "@near-wallet-selector/wallet-connect/assets/wallet-connect-icon.png";


declare global {
    interface Window {
        selector: WalletSelector | undefined;
        modal: WalletSelectorModal | undefined;
    }
}

interface WalletSelectorContextValue {
    selector: WalletSelector;
    modal: WalletSelectorModal;
    accounts: Array<AccountState>;
    accountId: string | null;
}

const WalletSelectorContext =
    createContext<WalletSelectorContextValue | null>(null);

export const WalletSelectorContextProvider: React.FC = ({children}: any) => {
    const [selector, setSelector] = useState<WalletSelector | null>(null);
    const [modal, setModal] = useState<WalletSelectorModal | null>(null);
    const [accounts, setAccounts] = useState<Array<AccountState>>([]);

    const init = useCallback(async () => {
        const _selector = await setupWalletSelector({
            network: "testnet",
            debug: true,
            modules: [
                setupNearWallet({
                    iconUrl: nearWalletConnectIconUrl
                }),
                setupMyNearWallet({
                    iconUrl: myNearWalletConnectIconUrl
                }),
                setupSender({
                    iconUrl: senderIconUrl
                }),
                setupMathWallet({
                    iconUrl: mathIconUrl
                }),
                setupNightly({
                    iconUrl: nightlyConnectIconUrl
                }),
                // setupLedger(),
                setupWalletConnect({
                    projectId: "c4f79cc...",
                    metadata: {
                        name: "NEAR Wallet Selector",
                        description: "Example dApp used by NEAR Wallet Selector",
                        url: "https://github.com/near/wallet-selector",
                        icons: ["https://avatars.githubusercontent.com/u/37784886"],
                    },
                    iconUrl: walletConnectIconUrl
                }),
                setupNightlyConnect({
                    url: "wss://ncproxy.nightly.app/app",
                    appMetadata: {
                        additionalInfo: "",
                        application: "NEAR Wallet Selector",
                        description: "Example dApp used by NEAR Wallet Selector",
                        icon: "https://near.org/wp-content/uploads/2020/09/cropped-favicon-192x192.png",
                    },
                    iconUrl: nightlyConnectIconUrl
                }),
            ],
        });
        const _modal = setupModal(_selector, {contractId: nearEnv.contractName});
        const state = _selector.store.getState();

        setAccounts(state.accounts);

        window.selector = _selector;
        window.modal = _modal;

        setSelector(_selector);
        setModal(_modal);
    }, []);

    useEffect(() => {
        init().catch((err) => {
            console.error(err);
            alert("Failed to initialise wallet selector");
        });
        return () => {
            setModal(null)
            window.modal = undefined
            window.selector = undefined;
        }
    }, [init]);

    useEffect(() => {
        if (!selector) {
            return;
        }

        const subscription = selector.store.observable
            .pipe(
                map((state) => state.accounts),
                distinctUntilChanged()
            )
            .subscribe((nextAccounts) => {
                console.log("Accounts Update", nextAccounts);

                setAccounts(nextAccounts);
            });

        return () => subscription.unsubscribe();
    }, [selector]);

    if (!selector || !modal) {
        return null;
    }

    const accountId =
        accounts.find((account) => account.active)?.accountId || null;

    return (
        <WalletSelectorContext.Provider
            value={{
                selector,
                modal,
                accounts,
                accountId,
            }}
        >
            {children}
        </WalletSelectorContext.Provider>
    );
};

export function useWalletSelector() {
    const context = useContext(WalletSelectorContext);

    if (!context) {
        throw new Error(
            "useWalletSelector must be used within a WalletSelectorContextProvider"
        );
    }

    return context;
}
