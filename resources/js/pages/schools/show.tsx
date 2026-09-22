import { Head, router } from "@inertiajs/react";
import { index, show } from "@/routes/schools";
import { School } from "@/types";
import { ArrowLeft, Building2, CreditCard, LayoutGrid, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { MouseEvent } from "react";

type TabKey = 'overview' | 'employees' | 'subscriptions';

export default function SchoolShow({ school, tab }: {
    school: School;
    tab: TabKey;
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
                className="m-4 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 rounded px-2 py-1"
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

            <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
                <Building2 size={28} className="text-neutral-400" />
                <p className="text-lg font-medium">Coming soon</p>
            </div>
        </>
    );
}
