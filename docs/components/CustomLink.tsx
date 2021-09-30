import Link from 'next/link'

type CustomLinkProps = {
  as: string;
  href: string;
}

export default function CustomLink({ as, href, ...otherProps }: CustomLinkProps) {
  return (
    <>
      <Link as={as} href={href}>
        <a {...otherProps} />
      </Link>
      <style jsx>{`
        a {
          color: tomato;
        }
      `}</style>
    </>
  )
}
