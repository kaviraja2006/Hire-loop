# Redis Caching Test Script
# This script tests the cache performance by making multiple requests

$BaseUrl = "http://localhost:3000"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Redis Caching Performance Tests" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: First request (Cache MISS - should hit database)
Write-Host "Test 1: First Request (Cache MISS)" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/users/cached"
$startTime = Get-Date
try {
    $response1 = Invoke-RestMethod -Uri "$BaseUrl/api/users/cached" -Method Get
    $endTime = Get-Date
    $duration1 = ($endTime - $startTime).TotalMilliseconds
    
    Write-Host "Response Time: $([math]::Round($duration1, 2))ms" -ForegroundColor Green
    Write-Host "Cached: $($response1.meta.cached)" -ForegroundColor $(if ($response1.meta.cached) { "Green" } else { "Yellow" })
    Write-Host "Message: $($response1.message)" -ForegroundColor Gray
    Write-Host "Users Count: $($response1.data.users.Count)" -ForegroundColor Gray
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Wait a moment
Start-Sleep -Seconds 1

# Test 2: Second request (Cache HIT - should be much faster)
Write-Host "Test 2: Second Request (Cache HIT)" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/users/cached"
$startTime = Get-Date
try {
    $response2 = Invoke-RestMethod -Uri "$BaseUrl/api/users/cached" -Method Get
    $endTime = Get-Date
    $duration2 = ($endTime - $startTime).TotalMilliseconds
    
    Write-Host "Response Time: $([math]::Round($duration2, 2))ms" -ForegroundColor Green
    Write-Host "Cached: $($response2.meta.cached)" -ForegroundColor $(if ($response2.meta.cached) { "Green" } else { "Yellow" })
    Write-Host "Message: $($response2.message)" -ForegroundColor Gray
    Write-Host "Users Count: $($response2.data.users.Count)" -ForegroundColor Gray
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Third request (Still cached)
Write-Host "Test 3: Third Request (Still Cached)" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/users/cached"
$startTime = Get-Date
try {
    $response3 = Invoke-RestMethod -Uri "$BaseUrl/api/users/cached" -Method Get
    $endTime = Get-Date
    $duration3 = ($endTime - $startTime).TotalMilliseconds
    
    Write-Host "Response Time: $([math]::Round($duration3, 2))ms" -ForegroundColor Green
    Write-Host "Cached: $($response3.meta.cached)" -ForegroundColor $(if ($response3.meta.cached) { "Green" } else { "Yellow" })
    Write-Host "Message: $($response3.message)" -ForegroundColor Gray
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Cache invalidation
Write-Host "Test 4: Cache Invalidation" -ForegroundColor Yellow
Write-Host "DELETE $BaseUrl/api/users/cached/cache"
try {
    $invalidate = Invoke-RestMethod -Uri "$BaseUrl/api/users/cached/cache" -Method Delete
    Write-Host "Invalidated Keys: $($invalidate.deletedKeys)" -ForegroundColor Green
    Write-Host "Message: $($invalidate.message)" -ForegroundColor Gray
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Wait a moment
Start-Sleep -Seconds 1

# Test 5: Request after cache invalidation (Should be cache MISS again)
Write-Host "Test 5: After Invalidation (Cache MISS)" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/users/cached"
$startTime = Get-Date
try {
    $response5 = Invoke-RestMethod -Uri "$BaseUrl/api/users/cached" -Method Get
    $endTime = Get-Date
    $duration5 = ($endTime - $startTime).TotalMilliseconds
    
    Write-Host "Response Time: $([math]::Round($duration5, 2))ms" -ForegroundColor Green
    Write-Host "Cached: $($response5.meta.cached)" -ForegroundColor $(if ($response5.meta.cached) { "Green" } else { "Yellow" })
    Write-Host "Message: $($response5.message)" -ForegroundColor Gray
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Performance Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Performance Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
if ($duration1 -and $duration2) {
    $improvement = [math]::Round((($duration1 - $duration2) / $duration1) * 100, 2)
    Write-Host "First Request (DB):    $([math]::Round($duration1, 2))ms" -ForegroundColor Yellow
    Write-Host "Cached Request:        $([math]::Round($duration2, 2))ms" -ForegroundColor Green
    Write-Host "Speed Improvement:     $improvement%" -ForegroundColor Cyan
    Write-Host "Time Saved:            $([math]::Round($duration1 - $duration2, 2))ms" -ForegroundColor Magenta
}
Write-Host ""
Write-Host "Note: Check server console for detailed cache HIT/MISS logs" -ForegroundColor Gray
Write-Host "================================" -ForegroundColor Cyan
