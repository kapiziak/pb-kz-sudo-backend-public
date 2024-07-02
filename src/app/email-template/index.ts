import ContentBlockBase from "./content-block/content-block-base";

class EmailTemplate {
    protected heading: string;
    protected content: ContentBlockBase[];

    constructor(heading: string, content: ContentBlockBase[]) {
        this.heading = heading;
        this.content = content;
    }

    protected getHtmlHeading() {
        return `<h1>${this.heading}</h1>`;
    }

    protected getHtmlContent() {
        return `<div>${this.content.map((x) => x.getHtml()).join("")}</div>`;
    }

    protected getHtmlFooter() {
        return `<footer style="font-size: 0.75rem;">Generated from SUDO App. Please, don't response for that email.</footer>`;
    }

    public addBlock(block: ContentBlockBase) {
        this.content.push(block);
    }

    public getHtml() {
        return `<html>
        <body>
        ${this.getHtmlHeading()}${this.getHtmlContent()}${this.getHtmlFooter()}
        </body>
        </html>`;
    }

    public getText() {
        return `${this.heading} ${this.content
            .map((x) => x.getReadableText())
            .join(" ")}`;
    }
}

export default EmailTemplate;
