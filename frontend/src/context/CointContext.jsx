import {createContext, useState, useContext, useEffect} from 'react';

export const CoinContext = createContext(
    {
        coins: 0,
        addCoin: () => {},
        removeCoin: () => {}
    }
);

export const CoinProvider = ({children}) => {
    const [coins, setCoins] = useState(2422);

    function addCoin(amount) {
        setCoins(coins + amount)
    }

    function removeCoin(amout) {
        setCoins(coins - amout)
    }


    return (
        <CoinContext.Provider value={{coins, addCoin, removeCoin}}>
            {children}
        </CoinContext.Provider>
    );
}

export const useCoins = () => {
    return useContext(CoinContext);
};
