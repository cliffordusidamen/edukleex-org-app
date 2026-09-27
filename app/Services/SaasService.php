<?php

namespace App\Services;

use App\Models\School;
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
                'message' => 'Base URL not set for SaasService.',
                'errors' => ['message' => 'Base URL not set for SaasService.'],
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
                $decoded = json_decode($response->body(), true);

                // Already a validation-style payload: pass through.
                if (is_array($decoded) && isset($decoded['errors'])) {
                    return $decoded;
                }

                // Normalise every other failure shape (message-only JSON,
                // singular error key, HTML/empty body, etc.) so callers can
                // reliably detect failure via the `errors` key instead of
                // mistaking it for success.
                if (is_array($decoded) && (isset($decoded['message']) || isset($decoded['error']))) {
                    $message = $decoded['message'] ?? $decoded['error'];
                    return [
                        'message' => is_string($message) ? $message : json_encode($message),
                        'errors' => ['message' => is_string($message) ? $message : json_encode($message)],
                        'status' => $response->status(),
                    ];
                }

                if (is_array($decoded) && !empty($decoded)) {
                    $detail = json_encode($decoded);
                    return [
                        'message' => 'Request failed with status ' . $response->status() . ': ' . $detail,
                        'errors' => ['message' => 'Request failed with status ' . $response->status() . ': ' . $detail],
                        'status' => $response->status(),
                        'payload' => $decoded,
                    ];
                }

                // Include the raw body (e.g. HTML error page) so the actual
                // server error is visible instead of just the status code.
                $rawBody = trim($response->body());
                $detail = $rawBody !== '' ? ': ' . mb_substr($rawBody, 0, 500) : '. No response body.';

                return [
                    'message' => 'Request failed with status ' . $response->status() . $detail,
                    'errors' => ['message' => 'Request failed with status ' . $response->status() . $detail],
                    'status' => $response->status(),
                ];
            }

            $decoded = $response->json();

            // Empty / non-JSON 2xx body: do not let callers treat as success.
            if (!is_array($decoded) || $decoded === []) {
                return [
                    'message' => 'Empty response from school server.',
                    'errors' => ['message' => 'Empty response from school server. The employee was not saved.'],
                    'status' => $response->status(),
                ];
            }

            // Explicit failure flags inside a 2xx payload.
            if (($decoded['success'] ?? null) === false || isset($decoded['error'])) {
                $message = $decoded['message'] ?? $decoded['error'] ?? 'Request was not successful.';
                return [
                    'message' => is_string($message) ? $message : json_encode($message),
                    'errors' => ['message' => is_string($message) ? $message : json_encode($message)],
                    'status' => $response->status(),
                    'payload' => $decoded,
                ];
            }

            return $decoded;
        } catch (\Throwable $e) {
            report($e);

            $detail = "Exception during $type request to SaasService: " . $e->getMessage();

            return [
                'message' => $detail,
                'errors' => ['message' => $detail],
            ];
        }
    }

    public function getEmployees(School $school, int $page): array
    {
        return $this->setBaseUrl($school->default_subdomain)
            ->makeGetRequest("/api/parent-api/employees", ['page' => $page]);
    }

    public function saveEmployee(School $school, array $data): mixed
    {
        if (empty($school->default_subdomain)) {
            return [
                'errors' => ['message' => 'School has no subdomain configured. The employee was not saved.'],
            ];
        }

        $this->setBaseUrl(app()->environment('local') ? 'http://127.0.0.1:8001' : $school->default_subdomain);
        return $this->makePostRequest("/api/parent-api/employees", $data);
    }
}
