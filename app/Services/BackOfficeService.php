<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class BackOfficeService
{
    private string $baseUrlPath;
    private string $host;

    public function __construct()
    {
        $this->baseUrlPath = env('BACKOFFICE_URL') . '/api/org-app';

        $this->baseUrlPath = (!app()->environment('production') ? 'http://' : 'https://')
            .str_replace(['http://', 'https://'], '', $this->baseUrlPath);

        $this->host = !app()->environment('production') ? env('DEV_DOMAIN') : request()->getHost();
    }

    public function getOrganisationData(string $domain): Array | null
    {
        $this->host = $domain;
        $organisationData = $this->makeGetRequest('/org-info');
        if (empty($organisationData['id'])) return null;

        return $organisationData;
    }

    public function createSchool(array $data, ?UploadedFile $logo): Array | null
    {
        return $this->makePostRequest(
            '/schools/store',
            $data,
            is_null($logo) ? [] : compact('logo')
        );
    }

    public function updateSchool(int $schoolId, array $data, ?UploadedFile $logo): Array | null
    {
        return $this->makePostRequest(
            "/schools/$schoolId/update",
            $data,
            is_null($logo) ? [] : compact('logo')
        );
    }

    public function updateUserStatus(int $userId, bool $isActive): Array | null
    {
        $data = ['is_active' => $isActive];
        return $this->makePostRequest("/users/$userId/update-status", $data);
    }

    public function createUser(array $data): Array | null
    {
        return $this->makePostRequest("/users/store", $data);
    }

    private function makeGetRequest(string $path): Array | null
    {
        return $this->makeRequest('GET', $path);
    }


    /**
     * Make request to the back office
     * 
     * @param  string  $path
     * @param  array  $data
     * @param  array<string, UploadedFile>  $files
     */
    private function makePostRequest(
        string $path,
        array $data = [],
        array $files = []
    ): Array | null
    {
        return $this->makeRequest('POST', $path, $data, $files);
    }

    /**
     * Make request to the back office
     * 
     * @param  string  $type
     * @param  string  $path
     * @param  array  $data
     * @param  array<string, UploadedFile>  $files
     */
    private function makeRequest(
        string $type,
        string $path,
        array $data = [],
        array $files = []
    ): Array | null
    {
        $type = strtolower($type);

        $headers = [
            'Accept' => 'application/json',
            'x-website' => $this->host,
        ];
    
        try {
            $request = Http::withHeaders($headers);

            if (count($files) > 0) {
                $request = $request->asMultipart();

                foreach ($files as $name => $file) {
                    $request = $request->attach($name, fopen($file->getRealPath(), 'r'));
                }
            } elseif ($type === 'post') {
                $request = $request->asJson();
            }

            $response = $request->$type($this->baseUrlPath . $path, $data);

            if ($response->failed()) {
                return json_decode($response->body(), true);
            }

            return $response->json();
        } catch (\Exception $e) {
            return [
                'errors' => [
                    "Exception during $type request to BackOfficeService: " . $e->getMessage(),
                ],
            ];
        }

        return null;
    }
}