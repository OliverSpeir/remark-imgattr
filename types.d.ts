declare module 'remark-imgattr' {
    /**
     * A Remark plugin to enhance markdown image syntax with additional attributes.
     * This plugin allows passing attributes to markdown image syntax via parentheses `()` immediately following the default syntax.
     *
     * For example, an image with custom styles and width could be written as:
     * `![alt text](imagePath)(style:"border: 1px solid #ccc;", width:100)`
     * 
     */
    export default function imgAttr(): (tree: any) => void;
}
