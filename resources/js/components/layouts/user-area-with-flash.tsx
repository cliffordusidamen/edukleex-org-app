import { FlashDisplay } from "@/components/flash-default";
import { Head } from "@inertiajs/react";

export default function UserAreaWithFlash({
    title,
    children
}: {
    children: React.ReactNode,
    title?: string,
}) {
    return (
        <div className="space-y-4">
            { !!title?.length && <Head title={title} /> }

            <div className="m-3">
                <FlashDisplay />
            </div>

            { children }
        </div>
    )
}
