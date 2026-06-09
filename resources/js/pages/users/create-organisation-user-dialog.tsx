import { TextInput } from "@/components/text-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { Organisation } from "@/types";
import { Form, router, usePage } from "@inertiajs/react";
import { FlashDisplay } from "@/components/flash-default";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

export default function CreateOrganisationUserDialog({
    organisation,
    onOpenChange,
    open,
}: {
    organisation: Organisation,
    open: boolean,
    onOpenChange?: (open: boolean) => void,
}) {
    const [internalOpen, setInternalOpen] = useState(open);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [autoGeneratePassword, setAutoGeneratePassword] = useState(false);
    const formRef = useRef(null);

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
                    <DialogTitle>Create Administrator</DialogTitle>
                </DialogHeader>


                <Form
                    ref={formRef}
                    action={`/users/store`}
                    method="post"
                    transform={(data) => ({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        password: data.auto_generate_password ? null : data.password,
                        auto_generate_password: autoGeneratePassword,
                    })}
                    onSuccess={(values) => {
                        if (formRef.current) {
                            (formRef.current as HTMLFormElement)?.reset();
                        }
                        setInternalOpen(false);
                        toast.success("User created successfully", { duration: 3000 });
                        setTimeout(() => {
                            router.replace({
                                url: `/users`,
                            });
                        }, 3000);
                    }}
                >

                    {({ errors, hasErrors, processing, wasSuccessful, resetAndClearErrors }) => (
                        
                        <>
                            {(wasSuccessful || hasErrors) && (
                                <div className="p-4">
                                    <FlashDisplay />
                                </div>
                            )}

                            <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                                <div className="p-4">
                                    <TextInput
                                        label="First Name"
                                        name="first_name"
                                        type="text"
                                        error={errors.first_name}
                                        required
                                    />
                                </div>

                                <div className="p-4">
                                    <TextInput
                                        label="Last Name"
                                        name="last_name"
                                        type="text"
                                        error={errors.last_name}
                                        required
                                    />
                                </div>

                                <div className="p-4">
                                    <TextInput
                                        label="Email"
                                        name="email"
                                        type="email"
                                        error={errors.email}
                                        required
                                    />
                                </div>

                                {!autoGeneratePassword && (
                                    <div className="p-4">
                                        <div className="w-full flex items-end justify-start">
                                            <div className="grow max-w-full">
                                                <TextInput
                                                    label="Password"
                                                    name="password"
                                                    type={passwordVisible ? "text" : "password"}
                                                    error={errors.password}
                                                    className="pr-8"
                                                    required={!autoGeneratePassword}
                                                />
                                            </div>

                                            <div className="-ml-7 mb-2">
                                                {passwordVisible ? (
                                                    <EyeOffIcon 
                                                        size={20} 
                                                        className="text-gray-500 cursor-pointer" 
                                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                                    />
                                                ) : (
                                                    <EyeIcon
                                                        size={20} 
                                                        className="text-gray-500 cursor-pointer" 
                                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}


                                <div className="p-4 mb-10">
                                    <Label htmlFor="auto-generate-password" className="flex items-start gap-3">
                                        <Checkbox
                                            id="auto-generate-password"
                                            checked={autoGeneratePassword}
                                            onCheckedChange={(checked) => setAutoGeneratePassword(checked as boolean)}
                                        />
                                        <div>
                                            Auto-generate password
                                            <p className="text-muted mt-2">A random password will be generated and sent to this user.</p>
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