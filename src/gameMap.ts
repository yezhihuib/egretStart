import { mazeMap } from "./constant/maze";
import { createBitmapByName } from "./utils/common";

interface IMap {
    game: eui.UILayer
}

const mapIdToTextureMap = {
    1: "texture-wall",
    0: "texture-road"
}

export class GameMap implements IMap {

    game;

    constructor(game: eui.UILayer) {
        this.game = game;
    }

    renderMap = () => {
        const stageWidth = this.game.stage.stageWidth;
        const unitSize = Math.floor(stageWidth / mazeMap.columnCount);
        for (let rowIndex = 0; rowIndex < mazeMap.rowCount; rowIndex++) {
            for (let columnIndex = 0; columnIndex < mazeMap.columnCount; columnIndex++) {
                const currentX = columnIndex * unitSize;
                const currentY = rowIndex * unitSize;
                const mapId = mazeMap.data[columnIndex * mazeMap.rowCount + rowIndex];
                const bitMap = createBitmapByName(mapIdToTextureMap[mapId]);
                bitMap.width = unitSize;
                bitMap.height = unitSize;
                bitMap.x = currentX;
                bitMap.y = currentY;
                this.game.addChild(bitMap);
            }
        }
    }

}