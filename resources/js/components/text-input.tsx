import React, { forwardRef } from "react"
import { Input as ShadcnInput } from "@/components/ui/input"

/**
 * TextInput
 * A wrapper around shadcn/ui <Input>
 * - Accepts every native input attribute via React.InputHTMLAttributes<HTMLInputElement>
 * - Forwards ref to the underlying input
 * - Optional `label`, `error`, and wrapper styling props
 */

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    /** Optional visible label text. If provided, an id will be set on the input if none exists. */
    label?: string
    /** Optional error message to show under the input */
    error?: string
    /** Optional wrapper className (Tailwind or any css) */
    wrapperClassName?: string
}

const TextInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { label, error, wrapperClassName = "", className = "", id, ...rest } = props

    // If user didn't provide an id, create one (simple fallback). Keep stable across renders is out of scope.
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`

    return (
        <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
            {label ? (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            ) : null}

            <ShadcnInput
                id={inputId}
                ref={ref}
                className={className}
                {...rest}
            />

            {error ? (
                <p className="text-xs text-red-600 mt-1" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    )
})

TextInput.displayName = "TextInput"

export { TextInput }
