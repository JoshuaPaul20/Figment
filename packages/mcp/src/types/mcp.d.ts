// Type declarations for gray-matter
declare module 'gray-matter' {
  interface GrayMatterFile<T> {
    data: T;
    content: string;
    excerpt?: string;
    orig: Buffer;
    language: string;
    matter: string;
    stringify(lang: string): string;
  }

  interface GrayMatterOptions {
    excerpt?: boolean | ((file: GrayMatterFile<unknown>, options: GrayMatterOptions) => string);
    excerpt_separator?: string;
    engines?: {
      [lang: string]: ((input: string) => unknown) | { parse: (input: string) => unknown; stringify?: (data: unknown) => string };
    };
    language?: string;
    delimiters?: string | [string, string];
  }

  function matter(input: string | Buffer, options?: GrayMatterOptions): GrayMatterFile<unknown>;
  export = matter;
}
