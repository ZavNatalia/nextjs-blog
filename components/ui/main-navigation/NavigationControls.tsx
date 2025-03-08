import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export function NavigationControls({ isMobile }: { isMobile?: boolean }) {
    const styles = isMobile
        ? 'flex gap-3 flex-col self-center items-center  text-muted-dark dark:text-muted-light md:gap-2'
        : 'ml-4 flex items-center gap-1 text-muted-dark dark:text-muted-light md:gap-2';
    return (
        <div className={styles}>
            {!isMobile && <span>|</span>}
            <LocaleSwitcher />
            {!isMobile && <span>|</span>}
            <ThemeSwitcher />
        </div>
    );
}
