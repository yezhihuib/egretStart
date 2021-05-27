import Matter = require("../libs/modules/matter/matter");

export class RectangleGameObj {

    physicsBody: Matter.Body;

    displayObj: egret.Shape;

    constructor(rect: Matter.Body) {
        this.physicsBody = rect;
    }

    createDisplayObj = () => {
        const width = this.physicsBody.bounds.max.x - this.physicsBody.bounds.min.x;
        const height = this.physicsBody.bounds.max.y - this.physicsBody.bounds.min.y;

        const x = this.physicsBody.bounds.min.x;
        const y = this.physicsBody.bounds.min.y;

        const rect = new egret.Shape();
        rect.graphics.beginFill(0xff0000);
        rect.graphics.drawRect(x, y, width, height);
        rect.graphics.endFill();
        this.displayObj = rect;
        console.log(this.displayObj);
        return this.displayObj;
    }

    updateDisplayObj = () => {
        const x = this.physicsBody.bounds.min.x;
        const y = this.physicsBody.bounds.min.y;
        this.displayObj.x = x;
        this.displayObj.y = y;
    }


}