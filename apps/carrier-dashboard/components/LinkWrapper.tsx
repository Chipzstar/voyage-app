import Link from 'next/link';

const LinkWrapper = ({ href, disabled, children, ...props }) => {
	if (disabled) {
		return <div>{children}</div>;
	}
	return (
		<Link href={href} {...props}>
			{children}
		</Link>
	);
};

export default LinkWrapper;