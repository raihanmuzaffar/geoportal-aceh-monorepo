<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class MlService
{
    public function predictDisaster(array $payload): array
    {
        $baseUrl = rtrim((string) config('services.ml.url'), '/');
        $timeout = (int) config('services.ml.timeout', 30);

        try {
            $response = Http::acceptJson()
                ->timeout($timeout)
                ->post("{$baseUrl}/api/v1/kebencanaan/predict-disaster", $payload);

            if ($response->failed()) {
                Log::error('ML Service returned error response', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new RuntimeException('ML Service failed to process prediction request.', 502);
            }

            return $response->json() ?? [];
        } catch (ConnectionException $e) {
            Log::error('Failed to connect to ML Service', [
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException('ML Service is currently unreachable.', 502, $e);
        }
    }
}