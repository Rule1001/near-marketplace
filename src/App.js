import React from "react";
import {WalletSelectorContextProvider} from "./contexts/WalletSelectorContext";
import Content from "./components/Content";


const App = () => {
    return (
            <>
            <WalletSelectorContextProvider>
                <Content/>
            </WalletSelectorContextProvider>
        </>

    );
};

export default App;
