export const isReactCode = (code: string): boolean => {
  return /import\s+.*from\s+['"]react['"]|<\w+|React\.|useState|useEffect/i.test(code);
};

export const smartFormatCode = (code: string): string => {
  const lines = code.split('\n');
  let indentLevel = 0;
  const formattedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      formattedLines.push('');
      continue;
    }
    
    if (/^[}\])]/.test(line)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    formattedLines.push('  '.repeat(indentLevel) + line);
    
    const openBraces = (line.match(/[{[(]/g) || []).length;
    const closeBraces = (line.match(/[}\])]/g) || []).length;
    const diff = openBraces - closeBraces;
    
    indentLevel = Math.max(0, indentLevel + diff);
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
    
    // 높이 자동 조정
    let lastHeight = 0;
    
    function sendHeight() {
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      // 높이가 실제로 변경되었을 때만 전송
      if (Math.abs(height - lastHeight) > 2) {
        lastHeight = height;
        window.parent.postMessage({ type: 'resize', height: height }, '*');
      }
    }
    
    // 초기 높이 전송
    setTimeout(sendHeight, 100);
    setTimeout(sendHeight, 500);
    setTimeout(sendHeight, 1000);
    
    // ResizeObserver로 크기 변화 감지
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
    
    // 높이 자동 조정
    let lastHeight = 0;
    
    function sendHeight() {
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      // 높이가 실제로 변경되었을 때만 전송
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