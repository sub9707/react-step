export const isReactCode = (code: string): boolean => {
  return /import\s+.*from\s+['"]react['"]|<\w+|React\.|useState|useEffect/i.test(code);
};

export const preserveIndentation = (code: string): string => {
  // 가장 작은 들여쓰기를 찾아서 제거 (normalize)
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);
  
  if (nonEmptyLines.length === 0) return code;
  
  // 각 줄의 들여쓰기 공백 개수 계산
  const indents = nonEmptyLines.map(line => {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  });
  
  const minIndent = Math.min(...indents);
  
  // 최소 들여쓰기를 제거하고 2칸 단위로 정규화
  return lines.map(line => {
    if (line.trim().length === 0) return '';
    const currentIndent = line.match(/^(\s*)/)?.[1].length || 0;
    const normalizedIndent = Math.max(0, currentIndent - minIndent);
    return '  '.repeat(Math.floor(normalizedIndent / 2)) + line.trim();
  }).join('\n');
};

export const smartFormatCode = (code: string): string => {
  // 먼저 원본 들여쓰기가 있는지 확인
  const hasIndentation = code.split('\n').some(line => /^\s{2,}/.test(line));
  
  // 원본에 이미 들여쓰기가 있으면 보존
  if (hasIndentation) {
    return preserveIndentation(code);
  }
  
  // 들여쓰기가 없으면 자동 포맷팅
  const lines = code.split('\n');
  let indentLevel = 0;
  const formattedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      formattedLines.push('');
      continue;
    }
    
    let cleanLine = line
      .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, '""')
      .replace(/\/\/.*$/g, '')
      .replace(/\/\*.*?\*\//g, '');
    
    // 닫는 것으로 시작하면 먼저 감소
    const startsWithClose = /^[}\])]/.test(cleanLine) || /^<\//.test(cleanLine);
    if (startsWithClose) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // 현재 줄 추가
    formattedLines.push('  '.repeat(indentLevel) + line);
    
    // JSX 분석
    const openingTags = (cleanLine.match(/<[a-zA-Z][a-zA-Z0-9]*[^>\/]*>/g) || [])
      .filter(tag => !tag.endsWith('/>'));
    const closingTags = cleanLine.match(/<\/[a-zA-Z][a-zA-Z0-9]*>/g) || [];
    
    indentLevel += openingTags.length;
    indentLevel -= closingTags.length;
    
    // 괄호 분석 (JSX 태그 외부만)
    let inTag = false;
    for (let j = 0; j < cleanLine.length; j++) {
      const char = cleanLine[j];
      
      if (char === '<') {
        inTag = true;
      } else if (char === '>') {
        inTag = false;
        continue;
      }
      
      if (!inTag) {
        if (char === '{' || char === '[' || char === '(') {
          indentLevel++;
        } else if (char === '}' || char === ']' || char === ')') {
          indentLevel = Math.max(0, indentLevel - 1);
        }
      }
    }
    
    indentLevel = Math.max(0, indentLevel);
  }
  
  return formattedLines.join('\n');
};

export const transformReactImports = (code: string): string => {
  let transformed = code;
  
  const importMatch = transformed.match(/import\s+{([^}]+)}\s+from\s+['"]react['"]\s*;?/);
  
  if (importMatch) {
    const hooks = importMatch[1]
      .split(',')
      .map(h => h.trim())
      .filter(h => h);
    
    transformed = transformed.replace(/import\s+{[^}]+}\s+from\s+['"]react['"]\s*;?\s*/g, '');
    
    hooks.forEach(hook => {
      const regex = new RegExp(`\\b${hook}\\b`, 'g');
      transformed = transformed.replace(regex, `React.${hook}`);
    });
  }
  
  transformed = transformed.replace(/import\s+React\s+from\s+['"]react['"]\s*;?\s*/g, '');
  
  return transformed;
};

export const generateReactHTML = (jsxCode: string): string => {
  const transformedCode = transformReactImports(jsxCode);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${transformedCode}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
    
    let lastHeight = 0;
    
    function sendHeight() {
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      if (Math.abs(height - lastHeight) > 2) {
        lastHeight = height;
        window.parent.postMessage({ type: 'resize', height: height }, '*');
      }
    }
    
    setTimeout(sendHeight, 100);
    setTimeout(sendHeight, 500);
    setTimeout(sendHeight, 1000);
    
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(sendHeight);
      resizeObserver.observe(document.body);
    }
  </script>
</body>
</html>`;
};

export const generateVanillaHTML = (jsCode: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div id="output"></div>
  <script>
    ${jsCode}
    
    let lastHeight = 0;
    
    function sendHeight() {
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      if (Math.abs(height - lastHeight) > 2) {
        lastHeight = height;
        window.parent.postMessage({ type: 'resize', height: height }, '*');
      }
    }
    
    setTimeout(sendHeight, 100);
    setTimeout(sendHeight, 500);
    
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(sendHeight);
      resizeObserver.observe(document.body);
    }
  </script>
</body>
</html>`;
};