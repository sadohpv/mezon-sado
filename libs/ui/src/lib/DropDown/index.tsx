import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Content, Item } from './Dropdown.Content';

type Place = 'bottom' | 'right' | 'left' | 'top' | `${'left' | 'right'}-${'bottom' | 'top'}`;

type MenuTriggerProps = {
	children: ReactNode;
	className?: string;
	dissmissOnClick?: boolean;
};
const Trigger = ({ children, className, dissmissOnClick = false }: MenuTriggerProps) => {
	const { triggerRef, toggleOpen, openListMenu, trigger } = useDropdownMenuContext();
	const handleClickTrigger = useCallback(() => {
		if (!dissmissOnClick) {
			toggleOpen();
		}
	}, [toggleOpen]);
	const handleHoverTrigger = useCallback(() => {
		if (trigger === 'hover') {
			openListMenu();
		}
	}, [openListMenu]);
	return (
		<div ref={triggerRef} onMouseEnter={handleHoverTrigger} className={`flex-1 ${className}`} onClick={handleClickTrigger}>
			{children}
		</div>
	);
};
Trigger.displayName = 'MenuTrigger';

interface MenuProps {
	children: ReactNode;
	className?: string;
	place?: Place;
	holdOnClick?: boolean;
	trigger?: 'hover' | 'click';
}

type DropdownMenuContextValue = {
	triggerRef: React.RefObject<HTMLDivElement>;
	open: boolean;
	toggleOpen: () => void;
	position?: React.CSSProperties;
	holdOnClickHandle: () => void;
	openListMenu: () => void;
	containerRef: React.RefObject<HTMLDivElement>;
	place: Place;
	trigger?: 'hover' | 'click';
	handleFloatingEnter: () => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

export function useDropdownMenuContext(): DropdownMenuContextValue {
	const context = useContext(DropdownMenuContext);
	if (!context) {
		throw new Error('useDropdownMenuContext must be used within a DropdownMenuProvider');
	}
	return context;
}

const Dropdown = ({ children, className, place = 'bottom', holdOnClick = false, trigger = 'click' }: MenuProps) => {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);
	const toggleOpen = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	const closeListMenu = useCallback(() => {
		setOpen(false);
	}, []);

	const openListMenu = useCallback(() => {
		setOpen(true);
	}, []);

	useEffect(() => {
		if (!open) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as Node;
			if (containerRef.current && !containerRef.current.contains(target)) {
				closeListMenu();
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [open, closeListMenu]);

	const position = useMemo(() => {
		switch (place) {
			case 'bottom':
				return { top: (containerRef.current?.offsetHeight || 0) + 10 };
			case 'top':
				return { bottom: (containerRef.current?.offsetHeight || 0) + 10 };
			case 'left':
				return { right: (containerRef.current?.offsetWidth || 0) + 10 };
			case 'right':
				return { left: (containerRef.current?.offsetWidth || 0) + 10 };
			default: {
				return;
			}
		}
	}, [open]);

	const holdOnClickHandle = () => {
		if (holdOnClick) return;
		closeListMenu();
	};

	const timeoutRef = useRef<number>();
	const handleLeaveDropdown = useCallback(() => {
		if (trigger === 'hover') {
			timeoutRef.current = window.setTimeout(() => {
				closeListMenu();
			}, 200);
		}
	}, [closeListMenu]);

	const handleFloatingEnter = () => {
		clearTimeout(timeoutRef.current);
	};
	const value = {
		open,
		triggerRef,
		toggleOpen,
		position,
		holdOnClickHandle,
		containerRef,
		openListMenu,
		place,
		trigger,
		handleFloatingEnter
	};
	return (
		<DropdownMenuContext.Provider value={value}>
			<div ref={containerRef} onMouseLeave={handleLeaveDropdown} className="relative flex items-center justify-center">
				{children}
			</div>
		</DropdownMenuContext.Provider>
	);
};

// gán Item vào Dropdown
Dropdown.Item = Item;
Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
export default Dropdown;
