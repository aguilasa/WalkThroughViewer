export class StepModel {
    constructor(
        public id: number,
        public game: number,
        public idLevel: number,
        public levelTitle: string,
        public textStep: string
    ) { }

    static fromJson(data: any) {
        return new StepModel(data.id, data.game, data.idLevel, data.levelTitle, data.textStep);
    }
}