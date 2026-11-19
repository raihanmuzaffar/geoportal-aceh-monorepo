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

        if ($baseUrl === '') {
            throw new RuntimeException('ML Service URL is not configured.', 502);
        }

        try {
            $response = Http::acceptJson()
                ->asJson()
                ->timeout($timeout)
                ->post(
                    "{$baseUrl}/api/ml/kebencanaan/predict-disaster",
                    $payload
                );

            if ($response->status() === 501) {
                throw new RuntimeException(
                    'Model prediksi kebencanaan belum tersedia.',
                    501
                );
            }

            if ($response->failed()) {
                Log::error('ML Service returned an error response', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new RuntimeException(
                    'ML Service failed to process the request.',
                    502
                );
            }

            $result = $response->json();

            if (
                ! is_array($result) ||
                ($result['status'] ?? null) !== 'success' ||
                ! is_array($result['data'] ?? null)
            ) {
                Log::error('ML Service returned an invalid response contract', [
                    'body' => $response->body(),
                ]);

                throw new RuntimeException(
                    'ML Service returned an invalid response.',
                    502
                );
            }

            return $result;
        } catch (ConnectionException $e) {
            Log::error('Failed to connect to ML Service', [
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException(
                'ML Service is currently unreachable.',
                502,
                $e
            );
        }
    }
}
