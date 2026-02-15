interface PageLoaderProps {
    message?: string;
}
// Loading component
function PageLoader({ message = 'LOADING...' }: PageLoaderProps) {
    return (
        <div className="page-container">
            <div className="glass-panel-dark p-8 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-game-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-game-text-secondary tracking-wider">
                    {message}
                </p>
            </div>
        </div>
    );
}

export default PageLoader;
