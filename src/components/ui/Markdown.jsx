import ReactMarkdown from 'react-markdown'
import SmartLink from './SmartLink'

const components = {
  a: ({ href, children }) => <SmartLink href={href}>{children}</SmartLink>,
}

export default function Markdown({ children }) {
  if (!children) return null
  return (
    <div className="prose">
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  )
}
