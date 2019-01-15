import { Drink } from "../drinks/drink.interface";

export class Round {
    /** Unique identifier of this specific round */
    id: number;
    /** The person whom is creating the round */
    creator: number;
    /** The group of which this round belongs to. */
    group: number;
    /** The status of this round */
    status: RoundStatus;
    /** The drinks current in this round and their status */
    drinks: { drink: Drink, status: DrinkStatus }[];

};

export enum RoundStatus {
    AWAITING = 0,
    PROGRESS = 1,
    COMPLETE = 2
}

export enum DrinkStatus {
    INCOMPLETE = 0,
    COMPLETE = 1
}