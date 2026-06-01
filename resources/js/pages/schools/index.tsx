import { PaginationData, School } from "@/types";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AlertCircleIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SchoolsTable from "./schools-table";

export default function OrganisationSchools({
    schools,
    countries,
}: {
    schools: School[]
    countries: { id: number, name: string }[],
}) {

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
                    <div className="text-lg">Schools</div>

                    <SchoolsTable
                        schools={schools}
                        countries={countries}
                    />
                </div>
            )}
        </>
    );
}