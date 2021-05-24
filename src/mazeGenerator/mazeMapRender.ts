import { MapUnitType } from "../constant/mapType";
import { createBitmapByName } from "../utils/common";
import { MazeMapBuilder } from "./mazeMap"

interface IMap {
    game: eui.UILayer
}

const mapIdToTextureMap = {
    [MapUnitType.WALL]: "texture-wall",
    [MapUnitType.ROAD]: "texture-road"
}

const getSmaller = (num1: number, num2: number) => {
    if (num1 < num2) {
        return num1;
    }
    return num2;
}

export class GameMap implements IMap {

    game: eui.UILayer;

    mazeBuilder: MazeMapBuilder;

    constructor(game: eui.UILayer) {
        this.game = game;
        this.mazeBuilder = new MazeMapBuilder(17, 9);
        this.mazeBuilder.generateMaze();
    }

    handleTouchMapUnit(rowIndex, columnIndex, mapId) {
        console.log(rowIndex, columnIndex, mapId)
    }

    renderMap = () => {
        const mazeMap = this.mazeBuilder.getMaze();
        const { stageWidth, stageHeight } = this.game.stage;
        const unitSize = getSmaller(Math.floor(stageWidth / mazeMap.columnCount), Math.floor(stageHeight / mazeMap.rowCount));
        for (let rowIndex = 0; rowIndex < mazeMap.rowCount; rowIndex++) {
            for (let columnIndex = 0; columnIndex < mazeMap.columnCount; columnIndex++) {
                const currentX = columnIndex * unitSize;
                const currentY = rowIndex * unitSize;
                const mapType = mazeMap.mazeMap[rowIndex * mazeMap.columnCount + columnIndex].type;
                const bitMap = createBitmapByName(mapIdToTextureMap[mapType]);
                bitMap.width = unitSize;
                bitMap.height = unitSize;
                bitMap.x = currentX;
                bitMap.y = currentY;
                bitMap.touchEnabled = true;
                bitMap.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handleTouchMapUnit.bind(this, rowIndex, columnIndex, mapType), this);
                this.game.addChild(bitMap);
            }
        }
    }

}