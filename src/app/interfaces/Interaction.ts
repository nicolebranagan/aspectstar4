export default interface Interaction {
    [index: number]: {
        name: string,
        text: string,
        font?: string,
    },
    length: number,
};
