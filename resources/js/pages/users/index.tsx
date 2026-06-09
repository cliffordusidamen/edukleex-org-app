import { FlashDisplay } from "@/components/flash-default";
import UserAreaWithFlash from "@/components/layouts/user-area-with-flash";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";

export default function UsersIndex({
    users,
}: {
    users: User[]
}) {
    const authUser = usePage().props.auth?.user

    return (
        <UserAreaWithFlash title="Users">

            <div className="px-5 py-4">
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