import { Dispatch, SetStateAction } from "react";
import { coinObject } from "./CoinInterfaces";

export interface popupContainerProps {
    type: string,
    isAddOpen?: boolean,
    isOptionsOpen?: boolean,
    handleMenuClose: () => void,
    handleOptionsToggle: (id: string) => void,
    handleUpdateMenuClose: () => void,
    payload?: {
        name: string,
        picture: string
    }
    renderPortfolios: (newPortfolio: portfolioObject) => void,
    renderPortfoliosWithUpdate: (updatedPortfolio: portfolioObject) => void
    renderPortfoliosWithoutDeleted: (deletedPortfolioId: string) => void,
    portfolioId?: string | undefined
}

export interface newPortfolioPayload {
    name: string,
    picture: string
}

export interface portfolioObject {
    _id: string,
    name: string,
    picture: string,
    owner: string,
    coins: Array<coinObject>,
    spent: number
    __v: number
}

export interface coinArray {
    name: string,
    id: string,
    course: string,
    price?: string,
    image: string
}
