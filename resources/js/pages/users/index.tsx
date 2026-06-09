import { FlashDisplay } from "@/components/flash-default";
import UserAreaWithFlash from "@/components/layouts/user-area-with-flash";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Organisation, User } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import CreateOrganisationUserDialog from "./create-organisation-user-dialog";

export default function UsersIndex({
    users,
}: {
    users: User[]
}) {
    const authUser = usePage().props.auth?.user;
    const organisation = usePage().props.organisation as Organisation;

    const [createOrganisationUserDialogOpen, setCreateOrganisationUserDialogOpen] = useState(false);

    return (
        <UserAreaWithFlash title="Users">

            <div className="px-5 py-4">
                <div className="mb-2 flex items-center justify-end">
                    <Button onClick={() => setCreateOrganisationUserDialogOpen(true)}>
                        <PlusIcon className="mr-2" />
                        Add User
                    </Button>
                </div>

                <Card className='p-0 overflow-hidden'>
                    <Table>
                        <TableHeader>
                            <TableRow className=''>
                                <TableHead className="">Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.full_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="text-center">
                                        {
                                            user.is_active
                                                ? <Badge variant="success">Active</Badge>
                                                : <Badge variant="danger">Inactive</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {authUser?.id != user.id && (
                                            <Button size="sm" onClick={() => {
                                                router.post(`/users/${user.id}/update-status`, {
                                                    is_active: !user.is_active,
                                                });
                                            }}>
                                                {user.is_active ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            {createOrganisationUserDialogOpen && (
                <CreateOrganisationUserDialog
                    open={createOrganisationUserDialogOpen}
                    organisation={organisation}
                    onOpenChange={setCreateOrganisationUserDialogOpen}
                />
            )}
        </UserAreaWithFlash>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: '/users',
        },
    ],
};