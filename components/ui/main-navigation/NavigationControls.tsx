import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export function NavigationControls({ isMobile }: { isMobile?: boolean }) {
    const styles = isMobile
        ? 'flex gap-3 flex-col self-center items-center bg-background-primary/50 py-3 px-4 rounded-2xl'
        : 'ml-3 flex items-center gap-1 md:gap-2 text-muted ' +
          'bg-background-primary px-3 rounded-2xl border border-border-100';
    return (
        <div className={styles}>
            <LocaleSwitcher />
            {isMobile ? (
                <div className="h-[1px] w-full bg-border-500" />
            ) : (
                <div className="h-6 w-px bg-border-500" />
            )}
            <ThemeSwitcher />
        </div>
    );
}
