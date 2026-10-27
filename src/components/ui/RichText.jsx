import { PortableText } from '@portabletext/react'
import SmartLink from './SmartLink'

const components = {
  marks: {
    link: ({ value, children }) => <SmartLink href={value?.href}>{children}</SmartLink>,
  },
  types: {
    image: ({ value }) => (value.url ? <img src={value.url} alt={value.alt ?? ''} loading="lazy" /> : null),
  },
}

export default function RichText({ value }) {
  if (!value?.length) return null
  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  )
}
