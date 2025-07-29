import { CSSProperties, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { useDropdownMenuContext } from '.';
type MenuItemProps = {
	children: ReactNode;
	onClick: () => void;
	className?: string;
};
const Item = ({ children, onClick, className }: MenuItemProps) => {
	return (
		<div className={`rounded-lg p-2 ${className}`} onClick={onClick}>
			{children}
		</div>
	);
};
Item.displayName = 'MenuItem';
type MenuContentProps = {
	children: ReactNode;
	className?: string;
};
const Content = ({ children, className }: MenuContentProps) => {
	const { open, holdOnClickHandle, containerRef, place, handleFloatingEnter } = useDropdownMenuContext();
	const [position, setPosition] = useState<CSSProperties>({});
	const contentRef = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		if (!open || !containerRef.current || !contentRef.current) return;

		const contentHeight = contentRef.current.offsetHeight;
		const contentWidth = contentRef.current.offsetWidth;

		let pos: CSSProperties = {};

		const overHeight = contentHeight + 10 > window.innerHeight - containerRef.current.offsetTop - containerRef.current.offsetHeight;

		switch (place) {
			case 'bottom':
				if (overHeight) {
					pos = { bottom: containerRef.current.offsetHeight + 10 };
				} else {
					pos = { top: containerRef.current.offsetHeight + 10 };
				}
				break;
			case 'top':
				if (overHeight) {
					pos = { bottom: containerRef.current.offsetHeight + 10 };
				} else {
					pos = { top: containerRef.current.offsetHeight + 10 };
				}
				break;
			case 'left-top':
				pos = { right: contentWidth + 10, top: 0 };

				break;
			case 'right-top':
				pos = { right: contentWidth + 10 };
				break;
			default:
				break;
		}

		setPosition(pos);
	}, [open, place]);

	if (!open) return;
	return (
		<div
			onMouseEnter={handleFloatingEnter}
			style={position}
			ref={contentRef}
			className={`absolute rounded-lg p-2 w-full bg-input-secondary text-theme-primary ${className}`}
		>
			<div className={`flex flex-col flex-1`} onClick={holdOnClickHandle}>
				{children}
			</div>
		</div>
	);
};

export { Content, Item };
