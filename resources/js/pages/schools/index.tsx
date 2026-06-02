import { Organisation, PaginationData, School } from "@/types";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AlertCircleIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SchoolsTable from "./schools-table";
import { useState } from "react";
import SchoolFormDialog from "./school-form-dialog";
import { usePage } from '@inertiajs/react';

export default function OrganisationSchools({
    schools,
    countries,
}: {
    schools: School[]
    countries: { id: number, name: string }[],
}) {

    const organisation = usePage().props.organisation as Organisation;

    const [createSchoolDialogOpen, setCreateSchoolDialogOpen] = useState(false); 

    return (
        <>
            {!schools.length && (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircleIcon size={20} />
                        </EmptyMedia>

                        <EmptyTitle>No School Added Yet!</EmptyTitle>
                    </EmptyHeader>

                    <EmptyContent>
                        <Button>
                            <PlusIcon className="mr-2" />
                            Add a school
                        </Button>
                    </EmptyContent>
                </Empty>
            )}

            {!!schools.length && (
                <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-lg">Schools</div>

                        <div className="mb-2 flex items-center justify-end">
                            <Button onClick={() => setCreateSchoolDialogOpen(true)}>
                                <PlusIcon className="mr-2" />
                                Add a school
                            </Button>
                        </div>
                    </div>

                    <SchoolsTable
                        schools={schools}
                        countries={countries}
                        organisation={organisation}
                    />
                </div>
            )}


            {createSchoolDialogOpen && (
                <SchoolFormDialog
                    open={createSchoolDialogOpen}
                    organisation={organisation}
                    onOpenChange={setCreateSchoolDialogOpen}
                    countries={countries}
                />
            )}
        </>
    );
}