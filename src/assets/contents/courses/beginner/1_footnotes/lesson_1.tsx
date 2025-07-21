import FootnoteCodeBox from '../../../../../components/CourseContent/FootnoteCodeBox';

export const ReactFootnoteData = {
    react: {
        id: 'react',
        content: (
            <div>
                <h3 className="text-lg font-semibold mb-2">React</h3>
                <p className="mb-3">
                    Facebook에서 개발한 JavaScript <strong>라이브러리</strong>입니다.
                </p>
                <p className="mb-3">
                    컴포넌트 기반의 선언적 프로그래밍을 통해 복잡한 UI를 효율적으로 구성할 수 있습니다.
                </p>
                <FootnoteCodeBox codes={
`function Welcome() {
return <h1>Hello, World!</h1>;
}`} />
                <div className="mt-3">
                    <a
                        href="https://react.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        React 공식 문서 →
                    </a>
                </div>
            </div>
        )
    },

    jsx: {
        id: 'jsx',
        content: (
            <div>
                <h3 className="text-lg font-semibold mb-2">JSX</h3>
                <p className="mb-3">
                    <strong>JavaScript XML</strong>의 줄임말입니다.
                </p>
                <p className="mb-3">
                    HTML과 유사한 문법을 JavaScript 안에서 사용할 수 있게 해주는 React의 확장 문법입니다.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md border-l-4 border-blue-500">
                    <p className="text-sm">
                        💡 <strong>팁:</strong> JSX는 Babel에 의해 JavaScript로 변환됩니다.
                    </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-3">
                    <pre className="text-sm">
                        <code>{`const element = <h1>Hello, {name}!</h1>;`}</code>
                    </pre>
                </div>
            </div>
        )
    },

    component: {
        id: 'component',
        content: (
            <div>
                <h3 className="text-lg font-semibold mb-2">컴포넌트</h3>
                <p className="mb-3">
                    React에서 UI를 구성하는 <strong>독립적이고 재사용 가능한</strong> 코드 조각입니다.
                </p>

                <div className="space-y-3">
                    <div>
                        <h4 className="font-medium mb-1">함수형 컴포넌트 (권장)</h4>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                            <pre className="text-sm">
                                <code>{`function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
}`}</code>
                            </pre>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md">
                        <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                            ✅ 장점
                        </h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 list-disc list-inside space-y-1">
                            <li>재사용성이 높음</li>
                            <li>테스트하기 쉬움</li>
                            <li>유지보수가 편함</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
};

export type FootnoteId = keyof typeof ReactFootnoteData;