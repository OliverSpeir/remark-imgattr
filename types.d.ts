declare module 'remark-imgattr' {
    /**
     * Main exported function of the plugin.
     * Since it integrates with Remark, it returns a transformer function
     * that operates on a Remark AST (Abstract Syntax Tree).
     */
    export default function imgAttr(): (tree: any) => void;
}