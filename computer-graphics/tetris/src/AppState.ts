import { IObject } from './IObject';

export class AppState {
    public static gouraudEnabled = false;

    public static activeTetracube: IObject[];
    public static generatedCubes: IObject[] = [];
    public static tetrid3DGrid: IObject[] = [];
    public static gameStopped: boolean = false;
    public static gameEnded: boolean = false;
    public static gamePaused: boolean = false;
    public static tetracubeDropDown: boolean = false;
}
