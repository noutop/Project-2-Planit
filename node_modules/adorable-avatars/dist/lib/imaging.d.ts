import sharp from 'sharp';
import { Face } from './FaceFactory';
export declare const parseSize: import("avatars-utils").ParseSizeFn;
export declare const combine: (face: Face) => sharp.Sharp;
export declare const resize: (rawSize: string) => sharp.Sharp;
