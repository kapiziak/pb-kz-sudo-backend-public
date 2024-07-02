import ContentBlockBase from "../content-block-base";

class TextContentBlock extends ContentBlockBase {
    protected type: "image" | "text";
    protected content: string;

    constructor(content: string) {
        super("text");
        this.type = "text";
        this.content = content;
    }

    getHtml(): string {
        return `<p>
                ${this.content}
            </p>`;
    }

    getReadableText(): string {
        return this.content;
    }
}

export default TextContentBlock;
