export type * from './auth';
export type * from './navigation';
export type * from './ui';

export type PaginationData<T> = {
    current_page: number,
    data: T[],
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: Array<{
        url: string | null,
        label: string,
        page?: number | null,
        active: Boolean
    }>,
    next_page_url: string | null,
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: number,
    total: number
}

export type Organisation = {
    id: number;
    name: string;
    type: string;
    country_id?: number;
    country?: string;
    city?: string;
    primary_phone: string;
    primary_email: string;
    website?: string;
    logo?: string;
    logo_url?: string;
    description?: string;
    schools_count?: number;
    users_count?: number;
    default_subdomain: string | null;
    custom_domain: string | null;
    custom_root_domain?: string;
    created_at: string;
    updated_at: string;
};

export type Country = {
    id: number;
    name: string;
}

export type School = {
    id: number;
    organisation_id: number;
    name: string;
    slogan?: string;
    logo_url?: string;
    default_subdomain: string | null;
    custom_domain: string | null;
    country?: Country;
    country_id?: number;
    created_at: string;
    updated_at: string;
};

