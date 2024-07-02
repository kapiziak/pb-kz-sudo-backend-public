import { ContentBlockType } from "./types/content-block-type";

class ContentBlockBase {
    protected type: ContentBlockType;

    constructor(type: ContentBlockType) {
        this.type = type;
    }

    public getHtml(): string {
        return "";
    }

    public getReadableText(): string {
        return "";
    }
}

export default ContentBlockBase;
