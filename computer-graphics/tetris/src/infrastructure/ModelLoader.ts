import { AssetLoader } from ".";

export interface Model {
    vertexBuffer: Float32Array;
    normalBuffer: Float32Array;
    textureMappingBuffer: Float32Array;
    vertices:  number[][];
}

export class ModelLoader {
    private static models: Map<string, Model> = new Map();

    public static async loadModel(modelName: string): Promise<void> {
        const content = await AssetLoader.loadAsset(`models/${modelName}.obj`)

        const rows = content.split('\n');

        const vertices: number[][] = [];
        const normals: number[][] = [];
        const textureMapping: number[][] = [];

        const vertexBuffer: number[][] = [];
        const normalBuffer: number[][] = [];
        const textureMappingBuffer: number[][] = [];

        rows.forEach((row) => {
            const tokens = row.split(' ');

            switch (tokens[0]) {
                case 'v':
                    vertices.push([Number(tokens[1]), Number(tokens[2]), Number(tokens[3]), 1.0]);
                    break;
                case 'vn':
                    normals.push([Number(tokens[1]), Number(tokens[2]), Number(tokens[3]), 1.0]);
                    break;
                case 'vt':
                    textureMapping.push([Number(tokens[1]), Number(tokens[2])]);
                    break;
                case 'f':
                    const [xIndex, textureXIndex, normalXIndex] = tokens[1].split('/');
                    const [yIndex, textureYIndex, normalYIndex] = tokens[2].split('/');
                    const [zIndex, textureZIndex, normalZIndex] = tokens[3].split('/');

                    vertexBuffer.push(vertices[Number(xIndex) - 1]);
                    vertexBuffer.push(vertices[Number(yIndex) - 1]);
                    vertexBuffer.push(vertices[Number(zIndex) - 1]);

                    normalBuffer.push(normals[Number(normalXIndex) - 1]);
                    normalBuffer.push(normals[Number(normalYIndex) - 1]);
                    normalBuffer.push(normals[Number(normalZIndex) - 1]);

                    textureMappingBuffer.push(textureMapping[Number(textureXIndex) - 1]);
                    textureMappingBuffer.push(textureMapping[Number(textureYIndex) - 1]);
                    textureMappingBuffer.push(textureMapping[Number(textureZIndex) - 1]);
                    break;
                default:
                    break;
            }
        });

        const model: Model = {
            vertexBuffer: new Float32Array(vertexBuffer.flat()),
            normalBuffer: new Float32Array(normalBuffer.flat()),
            textureMappingBuffer: new Float32Array(textureMappingBuffer.flat()),
            vertices
        };

        this.models.set(modelName, model);
    }

    public static getModel(modelName: string): Model {
        if (!this.models.has(modelName)) {
            throw new Error(`Model ${modelName} was not found. Load it first`);
        }

        return this.models.get(modelName);
    }
}
