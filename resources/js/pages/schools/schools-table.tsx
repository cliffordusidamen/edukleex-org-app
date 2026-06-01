import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Country, School } from "@/types"
import { Link } from "@inertiajs/react";
import { EllipsisVerticalIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";

export default function SchoolsTable({ schools, countries }: {
    schools: School[],
    countries: Country[],
}) {
    const [editSchoolDialogOpen, setEditSchoolDialogOpen] = useState(false); 
    const [editSchool, setEditSchool] = useState<School>();

    return (
        <>
            <Card className='p-0 overflow-hidden'>
                <Table>
                    <TableHeader>
                        <TableRow className=''>
                            <TableHead className="">Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className='text-center'>Default<br />Domain</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schools.map(school => (
                            <TableRow key={school.id}>
                                <TableCell className="font-medium">{school.name}</TableCell>
                                <TableCell>{school?.country?.name}</TableCell>
                                <TableCell className='text-center'>
                                    <a
                                        href={`http://${school?.default_subdomain?.replace('www.', '') || '#'}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        <ExternalLinkIcon className="inline-block mr-1" size={16} />
                                        {school.default_subdomain}
                                    </a>
                                </TableCell>
                                <TableCell className="text-right">

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">
                                                <EllipsisVerticalIcon size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end">
                                            <DropdownMenuItem onClick={() => {
                                                setEditSchool(school);
                                                setEditSchoolDialogOpen(true);
                                            }}>
                                                Edit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

        </>
    );
}