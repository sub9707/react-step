import type { JSX } from "react";

interface Token {
  type: string;
  value: string;
}

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export const SyntaxHighlighter = ({ code }: SyntaxHighlighterProps): JSX.Element => {
  const isDark = typeof window !== 'undefined' && 
    document.documentElement.classList.contains('dark');

  const tokenize = (code: string): Token[] => {
    const tokens: Token[] = [];
    let i = 0;

    while (i < code.length) {
      let matched = false;

      // 주석
      if (code[i] === '/' && i + 1 < code.length) {
        if (code[i + 1] === '/') {
          const end = code.indexOf('\n', i);
          const value = end === -1 ? code.slice(i) : code.slice(i, end);
          tokens.push({ type: 'comment', value });
          i += value.length;
          matched = true;
        } else if (code[i + 1] === '*') {
          const end = code.indexOf('*/', i + 2);
          const value = end === -1 ? code.slice(i) : code.slice(i, end + 2);
          tokens.push({ type: 'comment', value });
          i += value.length;
          matched = true;
        }
      }

      // 문자열
      if (!matched && (code[i] === '"' || code[i] === "'" || code[i] === '`')) {
        const quote = code[i];
        let value = quote;
        let j = i + 1;
        while (j < code.length) {
          if (code[j] === '\\' && j + 1 < code.length) {
            value += code[j] + code[j + 1];
            j += 2;
          } else if (code[j] === quote) {
            value += code[j];
            j++;
            break;
          } else {
            value += code[j];
            j++;
          }
        }
        tokens.push({ type: 'string', value });
        i = j;
        matched = true;
      }

      // 숫자
      if (!matched && /\d/.test(code[i])) {
        let value = '';
        while (i < code.length && /[\d.]/.test(code[i])) {
          value += code[i];
          i++;
        }
        tokens.push({ type: 'number', value });
        matched = true;
      }

      // 키워드 및 식별자
      if (!matched && /[a-zA-Z_$]/.test(code[i])) {
        let value = '';
        while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
          value += code[i];
          i++;
        }

        const keywords = [
          'function', 'const', 'let', 'var', 'return', 'if', 'else', 
          'for', 'while', 'import', 'from', 'export', 'default', 
          'class', 'extends', 'async', 'await', 'try', 'catch', 
          'throw', 'new', 'typeof', 'instanceof', 'break', 'continue',
          'switch', 'case', 'do'
        ];
        
        const booleans = ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'];

        let nextNonSpace = i;
        while (nextNonSpace < code.length && /\s/.test(code[nextNonSpace])) {
          nextNonSpace++;
        }
        const isFunction = nextNonSpace < code.length && code[nextNonSpace] === '(';

        if (keywords.includes(value)) {
          tokens.push({ type: 'keyword', value });
        } else if (booleans.includes(value)) {
          tokens.push({ type: 'boolean', value });
        } else if (isFunction) {
          tokens.push({ type: 'function', value });
        } else {
          tokens.push({ type: 'identifier', value });
        }
        matched = true;
      }

      // JSX 태그
      if (!matched && code[i] === '<') {
        const tagMatch = code.slice(i).match(/^<\/?[a-zA-Z][a-zA-Z0-9]*/);
        if (tagMatch) {
          tokens.push({ type: 'tag', value: tagMatch[0] });
          i += tagMatch[0].length;
          matched = true;
        }
      }

      // 기타 문자 (공백, 개행, 특수문자 포함)
      if (!matched) {
        tokens.push({ type: 'text', value: code[i] });
        i++;
      }
    }

    return tokens;
  };

  const getColor = (type: string): string => {
    const colors: Record<string, { light: string; dark: string }> = {
      keyword: { light: '#c700ff', dark: '#ff6ac1' },
      string: { light: '#c41a16', dark: '#ffb454' },
      function: { light: '#0033b3', dark: '#ffeb95' },
      number: { light: '#1750eb', dark: '#6fc1ff' },
      comment: { light: '#8c8c8c', dark: '#7ca668' },
      tag: { light: '#0033b3', dark: '#4ec9b0' },
      boolean: { light: '#0033b3', dark: '#569cd6' },
      identifier: { light: '#000000', dark: '#e8e8e8' },
      text: { light: '#000000', dark: '#d4d4d4' }
    };

    return isDark ? colors[type]?.dark || colors.text.dark : colors[type]?.light || colors.text.light;
  };

  const getFontWeight = (type: string): number => {
    if (type === 'keyword' || type === 'function') return 700;
    if (type === 'boolean') return 600;
    return 400;
  };

  const tokens = tokenize(code);

  return (
    <code style={{ 
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Consolas", monospace',
      lineHeight: '1.6',
      display: 'block',
      whiteSpace: 'pre',
      tabSize: 2
    }}>
      {tokens.map((token, index) => (
        <span
          key={index}
          style={{
            color: getColor(token.type),
            fontWeight: getFontWeight(token.type),
            fontStyle: token.type === 'comment' ? 'italic' : 'normal'
          }}
        >
          {token.value}
        </span>
      ))}
    </code>
  );
};