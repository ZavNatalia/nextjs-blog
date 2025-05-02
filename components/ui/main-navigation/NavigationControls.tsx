import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export function NavigationControls({ isMobile }: { isMobile?: boolean }) {
    const styles = isMobile
        ? 'flex gap-3 flex-col self-center items-center md:gap-2'
        : 'ml-3 flex items-center gap-1 md:gap-2 text-muted ' +
          'bg-background-primary/80 py-2 px-3 rounded-2xl';
    return (
        <div className={styles}>
            <LocaleSwitcher />
            {!isMobile && <div className="h-6 w-px bg-border-500" />}
            <ThemeSwitcher />
        </div>
    );
}
