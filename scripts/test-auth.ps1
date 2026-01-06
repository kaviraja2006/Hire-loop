# Authentication API Test Script (PowerShell)
# This script demonstrates testing all authentication endpoints

$BaseUrl = "http://localhost:3000"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Authentication API Test Suite" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Signup with new user
Write-Host "Test 1: Signup with new user" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/api/auth/signup"
$signupBody = @{
    name = "Alice Johnson"
    email = "alice@example.com"
    password = "securepassword123"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
    Write-Host ($signupResponse | ConvertTo-Json -Depth 10) -ForegroundColor Green
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# Test 2: Signup with duplicate email (should fail)
Write-Host "Test 2: Signup with duplicate email (should fail)" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/api/auth/signup"
$duplicateBody = @{
    name = "Alice Duplicate"
    email = "alice@example.com"
    password = "anotherpassword"
} | ConvertTo-Json

try {
    $duplicateResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/signup" -Method Post -Body $duplicateBody -ContentType "application/json"
    Write-Host ($duplicateResponse | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Expected error: $($_.ErrorDetails.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test 3: Login with correct credentials
Write-Host "Test 3: Login with correct credentials" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/api/auth/login"
$loginBody = @{
    email = "alice@example.com"
    password = "securepassword123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host ($loginResponse | ConvertTo-Json -Depth 10) -ForegroundColor Green
    $token = $loginResponse.token
    Write-Host ""
    Write-Host "Token extracted: $token" -ForegroundColor Green
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# Test 4: Login with wrong password (should fail)
Write-Host "Test 4: Login with wrong password (should fail)" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/api/auth/login"
$wrongPasswordBody = @{
    email = "alice@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $wrongResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $wrongPasswordBody -ContentType "application/json"
    Write-Host ($wrongResponse | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Expected error: $($_.ErrorDetails.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test 5: Login with non-existent email (should fail)
Write-Host "Test 5: Login with non-existent email (should fail)" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/api/auth/login"
$noUserBody = @{
    email = "nonexistent@example.com"
    password = "anypassword"
} | ConvertTo-Json

try {
    $noUserResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $noUserBody -ContentType "application/json"
    Write-Host ($noUserResponse | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Expected error: $($_.ErrorDetails.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test 6: Access protected route without token (should fail)
Write-Host "Test 6: Access protected route without token (should fail)" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/auth/protected"
try {
    $noTokenResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/protected" -Method Get
    Write-Host ($noTokenResponse | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Expected error: $($_.ErrorDetails.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test 7: Access protected route with invalid token (should fail)
Write-Host "Test 7: Access protected route with invalid token (should fail)" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/auth/protected"
$invalidHeaders = @{
    Authorization = "Bearer invalid.token.here"
}
try {
    $invalidTokenResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/protected" -Method Get -Headers $invalidHeaders
    Write-Host ($invalidTokenResponse | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Expected error: $($_.ErrorDetails.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test 8: Access protected route with valid token (should succeed)
Write-Host "Test 8: Access protected route with valid token (should succeed)" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/api/auth/protected"
if ($token) {
    $authHeaders = @{
        Authorization = "Bearer $token"
    }
    try {
        $protectedResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/protected" -Method Get -Headers $authHeaders
        Write-Host ($protectedResponse | ConvertTo-Json -Depth 10) -ForegroundColor Green
        Write-Host ""
        Write-Host "✓ Authentication flow completed successfully!" -ForegroundColor Green
    } catch {
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
} else {
    Write-Host "✗ Token not available, skipping protected route test" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Test Suite Completed" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
