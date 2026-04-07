import {
  Section,
  P,
  B,
  A,
  Highlight,
  IC,
  H3,
  Callout,
  Figure,
  Divider,
  ConnectedList,
  ConnectedItem,
  CodeBlock,
  Eq,
  EqBlock,
  TH,
  TR,
  TD,
} from './article-components'

// Map markdown fenced code blocks (```lang ... ```) to our CodeBlock component.
// MDX renders them as <pre><code className="language-python">...</code></pre>
function Pre({ children, ...rest }: any) {
  // Extract props from the nested <code> element
  const codeEl = children?.props
  if (codeEl) {
    const className = codeEl.className || ''
    const language = className.replace('language-', '')
    const code = typeof codeEl.children === 'string' ? codeEl.children : ''
    return <CodeBlock language={language} code={code.trimEnd()} />
  }
  return <pre {...rest}>{children}</pre>
}

export const mdxComponents = {
  Section,
  P,
  B,
  A,
  Highlight,
  IC,
  H3,
  Callout,
  Figure,
  Divider,
  ConnectedList,
  ConnectedItem,
  CodeBlock,
  Eq,
  EqBlock,
  TH,
  TR,
  TD,
  pre: Pre,
}
