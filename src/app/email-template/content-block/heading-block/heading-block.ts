import ContentBlockBase from "../content-block-base";
import { ContentBlockType } from "../types/content-block-type";

class HeadingContentBlock extends ContentBlockBase {
    protected type: ContentBlockType;
    protected heading: string;
    protected level: 1 | 2 | 3 | 4 | 5;

    constructor(level: 1 | 2 | 3 | 4 | 5, heading: string) {
        super("heading");
        this.type = "heading";
        this.heading = heading;
        this.level = level;
    }

    getHtml(): string {
        return `<h${this.level}>${this.heading}</h${this.level}>`;
    }

    getReadableText(): string {
        return this.heading;
    }
}

export default HeadingContentBlock;
