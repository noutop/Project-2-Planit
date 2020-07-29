export interface Face {
    color: string;
    eyes: string;
    nose: string;
    mouth: string;
}
export declare class FaceFactory {
    private colorHash;
    private eyeHash;
    private noseHash;
    private mouthHash;
    constructor(colors: string[], eyes: string[], noses: string[], mouths: string[]);
    create(string: any): Face;
}
declare const _default: FaceFactory;
export default _default;
