import { CheckCircle2Icon, InfoIcon, MessageCircleWarningIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { usePage } from "@inertiajs/react";

type FlashData = {
    type?: string,
    message?: string,
}
export function FlashDisplay() {
    const { flash } = usePage().props
    const message = (flash as FlashData)?.message;
    const type = (flash as FlashData)?.type;

    if (!message?.length) {
        return null
    }

    return (
        <Alert>
            {!type?.length || type.toLocaleLowerCase() === 'info' && (
                <InfoIcon />
            )}

            {!!type?.length && type.toLocaleLowerCase() === 'success' && (
                <CheckCircle2Icon />
            )}

            {!!type?.length && (type.toLocaleLowerCase() === 'error' || type.toLocaleLowerCase() === 'danger') && (
                <MessageCircleWarningIcon />
            )}

            <AlertTitle>{ message }</AlertTitle>
            <AlertDescription></AlertDescription>
        </Alert>
    )
}