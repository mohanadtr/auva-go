import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-brand-500 mx-auto" />
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading...</p>
            </div>
        </div>
    );
}
