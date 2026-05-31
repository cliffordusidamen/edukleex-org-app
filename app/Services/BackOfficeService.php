<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BackOfficeService
{
    private string $baseUrlPath;
    private string $host;

    public function __construct()
    {
        $this->baseUrlPath = env('BACKOFFICE_URL') . '/api/org-app';

        $this->baseUrlPath = (app()->environment('local') ? 'http://' : 'https://')
            .str_replace(['http://', 'https://'], '', $this->baseUrlPath);

        $this->host = request()->getHost();
    }

    public function getOrganisationData(string $domain): Array | null
    {
        $this->host = $domain;
        return $this->makeGetRequest('/org-info');
    }

    private function makeGetRequest(string $path): Array | null
    {
        return $this->makeRequest('GET', $path);
    }

    private function makePostRequest(string $path, array $data = []): Array | null
    {
        return $this->makeRequest('POST', $path, $data);
    }

    private function makeRequest(string $type, string $path, array $data = []): Array | null
    {
        $headers = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'x-website' => $this->host,
        ];
    
        try {
            $response = Http::withHeaders($headers)->$type($this->baseUrlPath . $path, $data);

            $organisationData = $response->json();

            if (empty($organisationData['id'])) return null;

            return $organisationData;

        } catch (\Exception $e) {}

        return null;
    }
}