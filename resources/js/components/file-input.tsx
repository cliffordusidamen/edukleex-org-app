import React, { ChangeEvent, forwardRef } from "react"
import { Input as ShadcnInput } from "@/components/ui/input"
import { Button } from "./ui/button"

/**
 * FileInput
 * A wrapper around shadcn/ui <Input>
 * - Accepts every native input attribute via React.InputHTMLAttributes<HTMLInputElement>
 * - Forwards ref to the underlying input
 * - Optional `label`, `error`, and wrapper styling props
 * - has image preview capability when the input type is file and the selected file is an image
 */

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    /** Optional visible label text. If provided, an id will be set on the input if none exists. */
    label?: string
    /** Optional error message to show under the input */
    error?: string
    /** Optional wrapper className (Tailwind or any css) */
    wrapperClassName?: string

    files?: FileList | null
}

const ImagePreview = ({ file }: {
    file: File | null
}) => {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

    React.useEffect(() => {

        if (!file) return

        const url = URL.createObjectURL(file)
        setPreviewUrl(url)

        return () => {
            URL.revokeObjectURL(url)
        }
    }, [file])

    if (!file || !previewUrl) return null

    return (
        <img src={previewUrl} alt="Preview" className="mt-2 max-h-40 object-contain" />
    )
}

const FileInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { label, error, wrapperClassName = "", className = "", id, ...rest } = props

    // If user didn't provide an id, create one (simple fallback). Keep stable across renders is out of scope.
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

    const localRef = React.useRef<HTMLInputElement>(null)

    const clearSelectedFile = () => {
        setSelectedFile(null)
        if (localRef.current) {
            localRef.current.value = ''
        }
    }

    const updateSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0] ?? null)
    }

    return (
        <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
            {label ? (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            ) : null}

            <ShadcnInput
                id={inputId}
                ref={ref || localRef}
                className={className}
                {...rest}
                type="file"
                onChange={updateSelectedFile}
            />

            {selectedFile && (
                <div className="flex flex-col gap-2">
                    <ImagePreview file={selectedFile} />
                    <Button onClick={clearSelectedFile}>Remove</Button>
                </div>
            )}

            {error ? (
                <p className="text-xs text-red-600 mt-1" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    )
})

FileInput.displayName = "FileInput"

export { FileInput }
