export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
        <h2 className="text-lg font-semibold text-foreground">Loading...</h2>
        <p className="text-sm text-muted-foreground">Please wait</p>
      </div>
    </div>
  );
}
