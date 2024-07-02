import ContentBlockBase from "../content-block-base";
import { ContentBlockType } from "../types/content-block-type";

class ImageContentBlock extends ContentBlockBase {
    protected type: ContentBlockType;
    protected imageSrc: string;

    constructor(imageSrc: string) {
        super("image");
        this.type = "image";
        this.imageSrc = imageSrc;
    }

    getHtml(): string {
        return `<img src="${this.imageSrc}" />`;
    }

    getReadableText(): string {
        return "Image";
    }
}

export default ImageContentBlock;
