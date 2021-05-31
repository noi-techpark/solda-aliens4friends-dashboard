<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class JsonProxy extends Controller
{
    public function get(Request $request)
    {
        $uri = $request->query('uri');

        try
        {
            $response = Http::get($uri);

            return response()->json([
                'uri' => $uri,
                'status' => $response->status(),
                'data' => $response->status() == 200 ? $response->json() : false,
            ], $response->status());
        }
        catch(\Exception $e)
        {
            $response = $e;

            return response()->json([
                'uri' => $uri,
                'status' => false,
                'data' => false,
            ], 500);
        }
    }
}
