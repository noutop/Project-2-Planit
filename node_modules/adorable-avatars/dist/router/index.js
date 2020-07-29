"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = __importDefault(require("uuid"));
const imageFiles_1 = require("../lib/imageFiles");
const imaging_1 = require("../lib/imaging");
const FaceFactory_1 = __importDefault(require("../lib/FaceFactory"));
const imageTypes = ['eyes', 'nose', 'mouth'];
const router = express_1.default();
const pngResponse = (response) => {
    response.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
    return response.type('image/png');
};
router.get('/list', (req, res) => {
    const face = {};
    imageTypes.forEach(type => (face[type] = imageFiles_1.imageFileNames(type)));
    res.set('Content-Type', 'application/json').send({ face });
});
router.get('/:size?/random', (req, res) => {
    const { size } = req.params;
    const face = FaceFactory_1.default.create(uuid_1.default.v4());
    imaging_1.combine(face)
        .png()
        .pipe(imaging_1.resize(size))
        .pipe(pngResponse(res));
});
router.get('/:size?/:id', (req, res, next) => {
    const { id, size } = req.params;
    const face = FaceFactory_1.default.create(id);
    imaging_1.combine(face)
        .png()
        .pipe(imaging_1.resize(size))
        .pipe(pngResponse(res));
});
router.get('/face/:eyes/:nose/:mouth/:color/:size?', (req, res, next) => {
    const { color, size } = req.params;
    const face = { color: `#${color}` };
    imageTypes.forEach(type => {
        const requestedName = req.params[type];
        const paths = imageFiles_1.imageFilePaths(type);
        face[type] = paths.find(path => !!path.match(requestedName)) || paths[0];
        if (requestedName === 'x') {
            face[type] = '';
        }
    });
    imaging_1.combine(face)
        .png()
        .pipe(imaging_1.resize(size))
        .pipe(pngResponse(res));
});
exports.default = router;
