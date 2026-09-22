import { Head, router } from "@inertiajs/react";
import { index, show } from "@/routes/schools";
import { School } from "@/types";
import { ArrowLeft, Building2, CreditCard, LayoutGrid, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { MouseEvent } from "react";

type TabKey = 'overview' | 'employees' | 'subscriptions';

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    created_at: string;
}

interface PaginatedEmployees {
    data: Employee[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function SchoolShow({ school, tab, employees }: {
    school: School;
    tab: TabKey;
    employees?: PaginatedEmployees;
}) {
    const group = show(school);

    const tabs = [
        { key: 'overview',
            label: 'Overview',
            icon: LayoutGrid,
            href: (event: MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                router.visit(show(school).url);
            },
        },
        {
            key: 'employees',
            label: 'Employees',
            icon: Users,
            href: (event: MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                router.visit(show(school).url + '/employees');
            },
        },
        {
            key: 'subscriptions',
            label: 'Subscriptions',
            icon: CreditCard,
            href: (event: MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                router.visit(show(school).url + '/subscriptions');
            },
        },
    ] as const;

    return (
        <>
            <Head title={`${school.name} · ${tab}`} />

            <button
                type="button"
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    router.visit(index().url);
                }}
                className="m-4 mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900"
            >
                <ArrowLeft size={16} />
                Back to Schools
            </button>

            <div className="flex items-center gap-3 m-4">
                {!!school?.logo_url?.length && (
                    <img src={school?.logo_url} alt='' className='h-12 w-12 bg-white border rounded' />
                )}
                <div>
                    <h1 className="text-xl font-semibold">{school.name}</h1>
                    <p className="text-sm text-neutral-500">
                        {school?.country?.name}{school?.default_subdomain && ` · ${school.default_subdomain}`}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-1 border-b">
                {tabs.map(({ key, label, icon: Icon, href }) => (
                    <a
                        key={key}
                        href='#'
                        onClick={href}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                            tab === key
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900',
                        )}
                    >
                        <Icon size={16} />
                        {label}
                    </a>
                ))}
            </div>

            <div className="mt-8">
                {tab === 'overview' && (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
                        <Building2 size={28} className="text-neutral-400" />
                        <p className="text-lg font-medium">Coming soon</p>
                    </div>
                )}

                {tab === 'employees' && (
                    <div className="px-4">
                        {employees && employees.data.length > 0 ? (
                            <div className="mt-4 flex flex-col gap-4">
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-neutral-50 text-neutral-500">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Name</th>
                                                <th className="px-4 py-2 font-medium">Email</th>
                                                <th className="px-4 py-2 font-medium">Role</th>
                                                <th className="px-4 py-2 font-medium">Status</th>
                                                <th className="px-4 py-2 font-medium">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {employees.data.map((employee) => (
                                                <tr key={employee.id} className="hover:bg-neutral-50">
                                                    <td className="px-4 py-2">{employee.name}</td>
                                                    <td className="px-4 py-2">{employee.email}</td>
                                                    <td className="px-4 py-2">{employee.role}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-xs font-medium",
                                                            employee.status === 'active' ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-700"
                                                        )}>
                                                            {employee.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2">{employee.created_at}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-xs text-neutral-500">
                                        Showing {employees.data.length} of {employees.total} employees
                                    </p>
                                    <div className="flex gap-2">
                                        {employees.current_page > 1 && (
                                            <a 
                                                href={`?page=${employees.current_page - 1}`}
                                                className="px-3 py-1 text-xs font-medium border rounded hover:bg-neutral-50"
                                            >
                                                Previous
                                            </a>
                                        )}
                                        {employees.current_page < employees.last_page && (
                                            <a 
                                                href={`?page=${employees.current_page + 1}`}
                                                className="px-3 py-1 text-xs font-medium border rounded hover:bg-neutral-50"
                                            >
                                                Next
                                                                                                                                                  
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
                                <Users size={28} className="text-neutral-400" />
                                <p className="text-lg font-medium">No employees found</p>
                            </div>
                        )}
                    </div>
                )}

                {tab === 'subscriptions' && (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
                        <Building2 size={28} className="text-neutral-400" />
                        <p className="text-lg font-medium">Coming soon</p>
                    </div>
                )}
            </div>
        </>
    );
}
