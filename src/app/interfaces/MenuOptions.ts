export default interface MenuOptions {
  options: {
    name: string;
    onChoose: () => void;
  }[];
  defaultSelected?: number;
  x?: number;
  y?: number;
}
