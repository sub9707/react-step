function FootnoteCodeBox({codes}:{codes: string}) {
    return (
        <div className="bg-gray-100 dark:bg-slate-600 p-3 rounded-md">
            <pre className="text-sm">
                <code>{codes}</code>
            </pre>
        </div>
    )
}

export default FootnoteCodeBox