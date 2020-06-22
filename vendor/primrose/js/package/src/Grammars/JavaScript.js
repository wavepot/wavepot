/*
pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "JavaScript",
  description: "A grammar for the JavaScript programming language."
});
*/

import { Grammar } from "./Grammar.js";
export const JavaScript = new Grammar("JavaScript", [
    ["newlines", /(?:\r\n|\r|\n)/],
    ["whitespace", /(?:\s+)/],
    ["startBlockComments", /\/\*/],
    ["endBlockComments", /\*\//],
    // ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/],
    ["stringDelim", /("|'|`)/],
    ["startLineComments", /\/\/.*$/m],
    ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
    // ["keywords",
    //     /\b(?:break|case|catch|class|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
    // ],
    ["operators", /!|>=?|<=?|={1,3}|(?:&){1,2}|\|?\||\?|\*|\/|~|\^|%|\.(?!\d)|\+{1,2}|\-{1,2}/],
    // ['functions', / ((?!\d|[. ]*?(if|else|do|for|case|try|catch|while|with|switch))[a-zA-Z0-9_ $]+)(?=\(.*\).*{)/],
    ['declare', /\b(function|interface|class|var|let|const|enum|void)\b/],
    ['keywords', /\b(break|case|catch|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|if|implements|import|in|instanceof|interface|let|new|package|private|protected|public|return|static|super|switch|throw|try|typeof|while|with|yield)\b/],
    ['builtin', /\b(Object|Function|Boolean|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|Number|Math|Date|String|RegExp|Array|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|ArrayBuffer|DataView|JSON|Intl|arguments|console|window|document|Symbol|Set|Map|WeakSet|WeakMap|Proxy|Reflect|Promise)\b/],
    ['special', /\b(true|false|null|undefined)\b/],
    // ['params', /function[ \(]{1}[^]*?\{/],
    ['numbers', /-?\b(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|-?Infinity)\b/],
    ['regexes', /(?![^\/])(\/(?![\/|\*]).*?[^\\\^]\/)([;\n\.\)\]\} gim])/],

    ["functions", /(\w+)(?:\s*\()/],
    ['symbol', /[{}[\](),:]/],
    ["members", /(\w+)\./],
    ["members", /((\w+\.)+)(\w+)/]
]);
