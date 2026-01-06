# Error Handling Middleware Test Script
# This script tests the centralized error handler with different error types

$BaseUrl = "http://localhost:3000"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Error Handling Middleware Tests" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Validation Error
Write-Host "Test 1: Validation Error" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/test/error?type=validation"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/test/error?type=validation" -Method Get
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Green
}
catch {
    Write-Host "Error Response: $($_.ErrorDetails.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test 2: Database Error
Write-Host "Test 2: Database Error" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/test/error?type=database"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/test/error?type=database" -Method Get
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Green
}
catch {
    Write-Host "Error Response: $($_.ErrorDetails.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test 3: Generic Error
Write-Host "Test 3: Generic Error" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/test/error?type=generic"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/test/error?type=generic" -Method Get
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Green
}
catch {
    Write-Host "Error Response: $($_.ErrorDetails.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test 4: No Error (Success case)
Write-Host "Test 4: Success Response (No Error)" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/test/error"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/test/error" -Method Get
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Green
}
catch {
    Write-Host "Error Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Note: Check console logs for structured error logging" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
