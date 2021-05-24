import { MapUnitType } from "../constant/mapType";

export class MapUnit {

    index: number;

    type: MapUnitType;

    constructor(index: number, type: MapUnitType) {
        this.index = index;
        this.type = type;
    }
}

export class MazeMapBuilder {

    private mazeMap: MapUnit[]

    private rowCount: number;

    private columnCount: number;

    private startIndex = 1;

    constructor(rowCount: number, columnCount: number) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        if (rowCount % 2 == 0 || columnCount % 2 == 0) {
            throw new Error("行数和列数都必须为奇数");
        }
        this.initMaze();
    }

    getMaze() {
        return {
            mazeMap: this.mazeMap,
            rowCount: this.rowCount,
            columnCount: this.columnCount,
        };
    }

    private initMaze() {
        this.mazeMap = new Array(this.columnCount * this.rowCount);
        for (let rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columnCount; columnIndex++) {
                const currentIndex = rowIndex * this.columnCount + columnIndex;
                if (columnIndex % 2 === 0 || rowIndex % 2 === 0) {
                    this.mazeMap[currentIndex] = new MapUnit(currentIndex, MapUnitType.WALL);
                } else {
                    this.mazeMap[currentIndex] = new MapUnit(currentIndex, MapUnitType.ROAD);
                }
            }
        }
        //设定起点和终点
        this.mazeMap[this.startIndex] = new MapUnit(this.startIndex, MapUnitType.ROAD);
        this.mazeMap[this.mazeMap.length - 2] = new MapUnit(this.mazeMap.length - 2, MapUnitType.ROAD);
    }

    public generateMaze() {
        const generator = new PrimMazeGenerator(this.mazeMap, this.rowCount, this.columnCount, this.startIndex);
        generator.generate();
        this.mazeMap = generator.getMazeMap();
        return this.getMaze();
    }
}

class PrimMapUnit extends MapUnit {

    isVisited: boolean;

    constructor(index: number, type: MapUnitType, isVisited: boolean) {
        super(index, type);
        this.isVisited = isVisited;
    }
}

export class PrimMazeGenerator {

    private mazeMap: PrimMapUnit[]

    private rowCount: number;

    private columnCount: number;

    private startIndex: number;

    constructor(mazeMap: MapUnit[], rowCount: number, columnCount: number, startIndex: number) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.mazeMap = mazeMap.map((item) => new PrimMapUnit(item.index, item.type, false));
        this.startIndex = startIndex;
    }

    public getMazeMap() {
        return this.mazeMap.map((item) => new MapUnit(item.index, item.type));
    }

    private getSurrounding(index: number): PrimMapUnit[] {
        const top = index <= this.columnCount ? undefined : this.mazeMap[index - this.columnCount];
        const bottom = index > this.columnCount * (this.rowCount - 1) ? undefined : this.mazeMap[index + this.columnCount];
        const left = index % this.columnCount === 0 ? undefined : this.mazeMap[index - 1];
        const right = index % this.columnCount === this.columnCount - 1 ? undefined : this.mazeMap[index + 1];
        return [top, bottom, left, right].filter(item => item);
    }

    public generate() {
        let allRoads = [this.mazeMap[this.startIndex]];
        let allWalls: PrimMapUnit[] = [];
        let allWallSets = new Set();

        let unVisitedRoads = allRoads.filter((item) => !item.isVisited);
        do {
            do {
                //通过未访问的道路来调查周边的墙，并加入墙列表  
                //console.log('un:', unVisitedRoads)
                let newRoads: PrimMapUnit[] = [];
                unVisitedRoads.forEach((road) => {
                    road.isVisited = true;
                    const mapUnits = this.getSurrounding(road.index);
                    //console.log('map:', mapUnits)
                    newRoads = newRoads.concat(mapUnits.filter((item) => item.type === MapUnitType.ROAD && !item.isVisited));
                    //console.log('newroads', mapUnits.filter((item) => item.type === "ROAD"));
                    const walls = mapUnits.filter((item) => item.type === MapUnitType.WALL && !allWallSets.has(item.index));
                    allWalls = allWalls.concat(walls);
                    walls.forEach((item => allWallSets.add(item.index)));
                });
                allRoads = allRoads.concat(newRoads);
                unVisitedRoads = allRoads.filter((item) => !item.isVisited);
            }
            while (unVisitedRoads.length > 0);
            //检查所有的墙是否值得拆除
            let removeWalls: PrimMapUnit[] = [];
            allWalls.forEach((wall) => {
                const surrounding = this.getSurrounding(wall.index);
                //若墙的周边没有未访问过的道路，则直接抛弃这堵墙，不加入墙列表
                if (!surrounding.find((item) => item.type === MapUnitType.ROAD && !item.isVisited)) {
                    removeWalls = removeWalls.concat(wall);
                }
            });
            const removeWallSet = new Set(removeWalls.map(item => item.index));
            allWalls = allWalls.filter((item) => !removeWallSet.has(item.index));
            removeWalls.forEach((item) => allWallSets.delete(item.index));
            //若已经没有墙了，结束循环
            if (allWalls.length === 0) {
                break;
            }
            //随机移除一个墙
            const rndIndex = Math.floor((Math.random() * allWalls.length));
            const removeWall = allWalls[rndIndex];
            allWalls = allWalls.filter(item => item.index !== removeWall.index);
            allWallSets.delete(removeWall.index);
            //将墙移除后变为道路，加入到道路集合中
            removeWall.type = MapUnitType.ROAD;
            allRoads = allRoads.concat(removeWall);
        }
        while (allWalls.length > 0);

    }

}

