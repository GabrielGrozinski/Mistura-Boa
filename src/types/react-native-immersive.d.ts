declare module "react-native-immersive" {
  export function on(): void;
  export function off(): void;
  export function setImmersive(flag: boolean): void;
  export function getImmersive(): Promise<boolean>;
  export default {
    on,
    off,
    setImmersive,
    getImmersive,
  };
}