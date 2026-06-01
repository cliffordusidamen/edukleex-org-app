import React, { forwardRef } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

/**
 * SelectInput (Normal Label)
 * A wrapper around shadcn/ui <Select> with a standard label above the select field
 * Accepts all native select attributes by exposing value and onValueChange props.
 */

type Option = {
    value: string
    label: string
}

type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string
    error?: string
    name?: string
    wrapperClassName?: string
    options: Option[]
    value?: string
    onValueChange?: (value: string) => void
}

const SelectInput = forwardRef<HTMLButtonElement, SelectInputProps>((props, ref) => {
    const { name, label, error, wrapperClassName = "", className = "", options, value, onValueChange } = props

    return (
        <div className={`w-full ${wrapperClassName}`}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                {label}
            </label>
            <Select
                defaultValue={`${value}`}
                onValueChange={onValueChange}
                name={name}
            >
                <SelectTrigger
                    ref={ref}
                    className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-0 ${error
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-400 focus:border-sky-600"
                        } ${className}`}
                >
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {error ? (
                <p className="text-xs text-red-600 mt-1" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    )
})

SelectInput.displayName = "SelectInput"

export { SelectInput }