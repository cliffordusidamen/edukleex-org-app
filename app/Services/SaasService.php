<?php

namespace App\Services;

use App\Models\School;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class SaasService
{
    private ?string $baseUrl = null;
    private ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = env('SAAS_API_KEY');
    }

    public function setBaseUrl(string $baseUrl): self
    {

        $this->baseUrl = preg_match('/^https?:\/\//i', $baseUrl)
            ? rtrim($baseUrl, '/')
            : 'http://' . rtrim($baseUrl, '/');
        return $this;
    }

    public function makeGetRequest(string $path, array $data = []): Array | null
    {
        return $this->makeRequest('GET', $path, $data);
    }

    public function makePostRequest(
        string $path,
        array $data = [],
        array $files = []
    ): Array | null
    {
        return $this->makeRequest('POST', $path, $data, $files);
    }

    public function makeRequest(
        string $type,
        string $path,
        array $data = [],
        array $files = []
    ): Array | null
    {
        if (!$this->baseUrl) {
            return [
                'errors' => ['Base URL not set for SaasService'],
            ];
        }

        $type = strtolower($type);

        $headers = [
            'Accept' => 'application/json',
        ];

        if ($this->apiKey) {
            $headers['api-key'] = $this->apiKey;
        }
    
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

            $response = $request->$type($this->baseUrl . '/' . ltrim($path, '/'), $data);
            
            if ($response->failed()) {
                return json_decode($response->body(), true);
            }

            return $response->json();
        } catch (\Exception $e) {
            return [
                'errors' => [
                    "Exception during $type request to SaasService: " . $e->getMessage(),
                ],
            ];
        }

        return null;
    }

    public function saveEmployee(School $school, array $data): mixed
    {
        $this->setBaseUrl($school->default_subdomain);
        return $this->makePostRequest("/parent-api/employees", $data);
    }
}
