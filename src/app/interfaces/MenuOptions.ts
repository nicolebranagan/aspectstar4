export default interface MenuOptions {
    options : {
        name: string,
        onChoose: () => void,
    }[],
    centered : boolean,
    defaultSelected? : number,
    x? : number,
    y? : number,
};
