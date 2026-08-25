import { SelectInput } from "@/components/select-input";
import { TextInput } from "@/components/text-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { Organisation, School } from "@/types";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Form, router, usePage } from "@inertiajs/react";
import { FlashDisplay } from "@/components/flash-default";
import toast from "react-hot-toast";
import { FileInput } from "@/components/file-input";

export default function SchoolFormDialog({
    organisation,
    onOpenChange,
    countries,
    open,
    school
}: {
    organisation: Organisation,
    open: boolean,
    onOpenChange?: (open: boolean) => void,
    countries: { id: number, name: string }[],
    school?: School,
}) {
    const [internalOpen, setInternalOpen] = useState(open);
    const domain = usePage().props.app_domain as string;
    const formRef = useRef(null);
    const [hasMultipleProgrammes, setHasMultipleProgrammes] = useState(school?.has_multiple_programmes ?? false);
    const actionUrl = school
        ? `/schools/${school.id}/update`
        : `/schools/store`;

    return (
        <Dialog
            open={internalOpen}
            modal={internalOpen}
            onOpenChange={(open) => {
                setInternalOpen(open);
                onOpenChange?.(open);
            }}
        >
            <DialogContent>
                <DialogHeader className="border-b pb-4">
                    <DialogTitle>{school ? "Edit School" : "Create School"}</DialogTitle>
                </DialogHeader>


                <Form
                    ref={formRef}
                    action={actionUrl}
                    method="post"
                    onSuccess={(values) => {
                        if (formRef.current) {
                            (formRef.current as HTMLFormElement)?.reset();
                        }

                        toast.success(`School ${school ? 'updated' : 'created'} successfully!`);
                        setInternalOpen(false);
                        onOpenChange?.(false);
                        router.replace({
                            url: `/schools`,
                        });

                    }}
                >

                    {({ errors, hasErrors, processing, wasSuccessful, resetAndClearErrors }) => (
                        
                        <>
                            {(hasErrors) && (
                                <div className="p-4">
                                    <FlashDisplay />
                                </div>
                            )}

                            <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">

                                <div className="flex flex-row items-start justify-start gap-2">

                                    {!!school?.logo_url?.length && (
                                        <img src={school?.logo_url} alt='' className='h-15 bg-white border rounded' />
                                    )}

                                    <div className="grow p-2">
                                        <FileInput
                                            label="Logo"
                                            name="logo"
                                            wrapperClassName='mb-3'
                                            error={errors.logo}
                                            accept=".jpg,.jpeg,.png,.wmp"
                                        />
                                    </div>
                                </div>

                                <div className="p-4">
                                    <TextInput
                                        label="Name of School"
                                        name="name"
                                        type="text"
                                        error={errors.name}
                                        defaultValue={school?.name}
                                        required
                                    />
                                </div>

                                <div className="p-4">
                                    <TextInput
                                        label="Slogan (optional)"
                                        name="slogan"
                                        type="text"
                                        error={errors.slogan}
                                        defaultValue={school?.slogan}
                                    />
                                </div>

                                <div className="p-4">
                                    <SelectInput
                                        label="Country"
                                        name="country_id"
                                        options={countries.map(country => ({
                                            label: country.name,
                                            value: `${country.id}`,
                                        }))}
                                        error={errors.country_id}
                                        value={school?.country_id ? `${school.country_id}` : undefined}
                                        required
                                    />
                                </div>

                                <div className="p-4">
                                    {!school && (
                                        <div className="w-full flex flex-col mt-5 mb-5">
                                            <Label htmlFor="email-2" className="text-gray-700 mb-2">
                                                Default Subdomain
                                            </Label>
                                            <InputGroup>
                                                <InputGroupInput placeholder="" name="default_subdomain" className="pl-1!" maxLength={10} />
                                                <InputGroupAddon>
                                                    <InputGroupText>https://</InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>.{ domain }</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {errors.default_subdomain ? (
                                                <p className="text-xs text-red-600 mt-1" role="alert">
                                                    {errors.default_subdomain}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}

                                    {!!organisation?.custom_root_domain && (
                                        <div className="w-full flex flex-col mt-5 mb-5">
                                            <Label htmlFor="email-2" className="text-gray-700 mb-2">
                                                Custom Subdomain
                                            </Label>
                                            <InputGroup>
                                                <InputGroupInput
                                                    placeholder=""
                                                    name="custom_domain"
                                                    className="pl-1!"
                                                    maxLength={150}
                                                    defaultValue={school?.custom_domain?.replace('www.', '') ?? ''}
                                                />
                                                <InputGroupAddon>
                                                    <InputGroupText>https://</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {errors.custom_domain ? (
                                                <p className="text-xs text-red-600 mt-1" role="alert">
                                                    {errors.custom_domain}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                </div>


                                <div className="p-4">
                                    <Label htmlFor="has-multiple-programmes" className="flex items-center gap-3">
                                        <input type="hidden" name="has_multiple_programmes" value={hasMultipleProgrammes ? '1' : '0'} />
                                        <Checkbox
                                            id="has-multiple-programmes"
                                            checked={hasMultipleProgrammes}
                                            onCheckedChange={(checked) => setHasMultipleProgrammes(checked === true)}
                                        />
                                        <div>
                                            Run multiple programmes
                                            <p className="text-muted mt-2">
                                                Aside from the normal academic programmes, does the school enrol students for other programmes within same semester/term?
                                            </p>
                                        </div>
                                    </Label>
                                </div>
                            </div>
                            <DialogFooter className="border-t pt-4 flex-row justify-center sm:justify-center">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'Please wait...' : 'SUBMIT'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    )
}