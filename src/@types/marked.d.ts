//The @types/marked definitions module I was using was giving me some annoying 'global UMD module use import' error. ALthough the code was fine on the browser, TS didn't like it.

declare var marked: marked;

//https://github.com/ts-stack/markdown#api
interface marked
{
    /**
     * Accepts Markdown text and returns text in HTML format.
     * 
     * @param src String of markdown source to be compiled.
     * 
     * @param options Hash of options. They replace, but do not merge with the default options.
     * If you want the merging, you can to do this via `Marked.setOptions()`.
     * 
     * Can also be set using the `Marked.setOptions` method as seen above.
     */
    static parse(src: string, options?: MarkedOptions): string;

    /**
     * Accepts Markdown text and returns object with text in HTML format,
     * tokens and links from `BlockLexer.parser()`.
     * 
     * @param src String of markdown source to be compiled.
     * @param options Hash of options. They replace, but do not merge with the default options.
     * If you want the merging, you can to do this via `Marked.setOptions()`.
     */
    static debug(src: string, options?: MarkedOptions): {result: string, tokens: Token[], links: Links};


    /**
     * Merges the default options with options that will be set.
     * 
     * @param options Hash of options.
     */
    static setOptions(options: MarkedOptions): this;
}

interface Token
{
   type: number | string;
   text?: string;
   lang?: string;
   depth?: number;
   header?: string[];
   align?: ('center' | 'left' | 'right')[];
   cells?: string[][];
   ordered?: boolean;
   pre?: boolean;
   escaped?: boolean;
   execArr?: RegExpExecArray;
   /**
    * Used for debugging. Identifies the line number in the resulting HTML file.
    */
   line?: number;
}
 
enum TokenType
{
   space = 1
   ,text
   ,paragraph
   ,heading
   ,listStart
   ,listEnd
   ,looseItemStart
   ,looseItemEnd
   ,listItemStart
   ,listItemEnd
   ,blockquoteStart
   ,blockquoteEnd
   ,code
   ,table
   ,html
   ,hr
}
 
// This class also using as an interface.
class MarkedOptions
{
   gfm?: boolean = true;
   tables?: boolean = true; //This seems to have been removed.
   breaks?: boolean = false;
   pedantic?: boolean = false;
   sanitize?: boolean = false;
   sanitizer?: (text: string) => string;
   mangle?: boolean = true;
   smartLists?: boolean = false;
   silent?: boolean = false;
   /**
    * @param code The section of code to pass to the highlighter.
    * @param lang The programming language specified in the code block.
    */
   highlight?: (code: string, lang?: string) => string;
   langPrefix?: string = 'lang-';
   smartypants?: boolean = false;
   headerPrefix?: string = '';
   /**
    * An object containing functions to render tokens to HTML. Default: `new Renderer()`
    */
   renderer?: Renderer;
   /**
    * Self-close the tags for void elements (&lt;br/&gt;, &lt;img/&gt;, etc.)
    * with a "/" as required by XHTML.
    */
   xhtml?: boolean = false;
   /**
    * The function that will be using to escape HTML entities.
    * By default using inner helper.
    */
   escape?: (html: string, encode?: boolean) => string = escape;
   /**
    * The function that will be using to unescape HTML entities.
    * By default using inner helper.
    */
   unescape?: (html: string) => string = unescape;
   /**
    * If set to `true`, an inline text will not be taken in paragraph.
    * 
    * ```ts
    * // isNoP == false
    * Marked.parse('some text'); // returns '<p>some text</p>'
    * 
    * Marked.setOptions({isNoP: true});
    * 
    * Marked.parse('some text'); // returns 'some text'
    * ```
    */
   isNoP?: boolean;
}