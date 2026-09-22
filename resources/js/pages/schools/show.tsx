import { Head, router, useForm } from "@inertiajs/react";
import { index, show } from "@/routes/schools";
import { School } from "@/types";
import { ArrowLeft, Building2, CreditCard, LayoutGrid, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MouseEvent, useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const group = show(school);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: 'Mr',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        employee_id: '',
        designation: '',
        is_admin: false,
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(show(school).url + '/employees', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

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
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Employees</h2>
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DialogTrigger asChild>
                                    <button 
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus size={14} />
                                        Add Employee
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add Employee</DialogTitle>
                                        <DialogDescription>
                                            Add a new employee to this school.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-neutral-600">Title</label>
                                                <select 
                                                    value={data.title} 
                                                    onChange={e => setData('title', e.target.value)}
                                                    className="text-sm border rounded px-2 py-1.5 focus:outline-blue-500"
                                                >
                                                    <option value="Mr">Mr</option>
                                                    <option value="Mrs">Mrs</option>
                                                    <option value="Ms">Ms</option>
                                                    <option value="Dr">Dr</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-neutral-600">First Name</label>
                                                <input 
                                                    type="text" 
                                                    value={data.first_name} 
                                                    onChange={e => setData('first_name', e.target.value)}
                                                    className="text-sm border rounded px-2 py-1.5 focus:outline-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-neutral-600">Last Name</label>
                                                <input 
                                                    type="text" 
                                                    value={data.last_name} 
                                                    onChange={e => setData('last_name', e.target.value)}
                                                    className="text-sm border rounded px-2 py-1.5 focus:outline-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-neutral-600">Email</label>
                                                <input 
                                                    type="email" 
                                                    value={data.email} 
                                                    onChange={e => setData('email', e.target.value)}
                                                    className="text-sm border rounded px-2 py-1.5 focus:outline-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-neutral-600">Phone Number</label>
                                                <input 
                                                    type="text" 
                                                    value={data.phone_number} 
                                                    onChange={e => setData('phone_number', e.target.value)}
                                                    className="text-sm border rounded px-2 py-1.5 focus:outline-blue-500"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-neutral-600">Employee ID</label>
                                                <input 
                                                    type="text" 
                                                    value={data.employee_id} 
                                                    onChange={e => setData('employee_id', e.target.value)}
                                                    className="text-sm border rounded px-2 py-1.5 focus:outline-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-neutral-600">Designation</label>
                                            <input 
                                                type="text" 
                                                value={data.designation} 
                                                onChange={e => setData('designation', e.target.value)}
                                                className="text-sm border rounded px-2 py-1.5 focus:outline-blue-500"
                                            />
                                        </div>
                                        <div className="flex items-start gap-2 py-2">
                                            <input 
                                                type="checkbox" 
                                                id="is_admin"
                                                checked={data.is_admin} 
                                                onChange={e => setData('is_admin', e.target.checked)}
                                                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="is_admin" className="cursor-pointer">
                                                <span className="text-xs font-medium text-neutral-600 block">Set as admin</span>
                                                <span className="text-[10px] text-neutral-500">As administrator, this person will have full control in the system</span>
                                            </label>
                                        </div>
                                        <DialogFooter>
                                            <button 
                                                type="button" 
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={processing}
                                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                            >
                                                {processing ? 'Creating...' : 'Create Employee'}
                                            </button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {employees && employees.data.length > 0 ? (
                            <div className="flex flex-col gap-4">
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
