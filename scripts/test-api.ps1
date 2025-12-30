# PowerShell API Testing Script
# Run this script to test all API endpoints

Write-Host "=== Testing Hire-Loop API Routes ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$contentType = "application/json"

# Track created IDs for later tests
$userId1 = $null
$userId2 = $null
$jobId1 = $null
$applicationId1 = $null

Write-Host "1. Testing Users API" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# Create Candidate User
Write-Host "`nCreating Candidate User..." -ForegroundColor Green
$candidateBody = @{
    email = "john.candidate@example.com"
    name = "John Candidate"
    role = "CANDIDATE"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Post -Body $candidateBody -ContentType $contentType
    $userId1 = $response.id
    Write-Host "✓ Created candidate with ID: $userId1" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "✗ Failed to create candidate" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Create Recruiter User
Write-Host "`nCreating Recruiter User..." -ForegroundColor Green
$recruiterBody = @{
    email = "jane.recruiter@example.com"
    name = "Jane Recruiter"
    role = "RECRUITER"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Post -Body $recruiterBody -ContentType $contentType
    $userId2 = $response.id
    Write-Host "✓ Created recruiter with ID: $userId2" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "✗ Failed to create recruiter" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Get All Users
Write-Host "`nGetting All Users..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Get
    Write-Host "✓ Found $($response.pagination.total) users" -ForegroundColor Green
    Write-Host "Pagination: Page $($response.pagination.page) of $($response.pagination.totalPages)"
} catch {
    Write-Host "✗ Failed to get users" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Get Users with Pagination
Write-Host "`nTesting Pagination (limit=1)..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users?page=1&limit=1" -Method Get
    Write-Host "✓ Pagination works - returned $($response.data.Count) user(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Pagination test failed" -ForegroundColor Red
}

# Filter by Role
Write-Host "`nFiltering by Role (RECRUITER)..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users?role=RECRUITER" -Method Get
    Write-Host "✓ Found $($response.pagination.total) recruiter(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Filter test failed" -ForegroundColor Red
}

# Get Specific User
if ($userId1) {
    Write-Host "`nGetting Specific User ($userId1)..." -ForegroundColor Green
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/users/$userId1" -Method Get
        Write-Host "✓ Retrieved user: $($response.name)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to get user" -ForegroundColor Red
    }
}

# Update User
if ($userId1) {
    Write-Host "`nUpdating User..." -ForegroundColor Green
    $updateBody = @{
        name = "John Updated Candidate"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/users/$userId1" -Method Put -Body $updateBody -ContentType $contentType
        Write-Host "✓ Updated user: $($response.name)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to update user" -ForegroundColor Red
    }
}

Write-Host "`n`n2. Testing Jobs API" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# Create Job
if ($userId2) {
    Write-Host "`nCreating Job Posting..." -ForegroundColor Green
    $jobBody = @{
        title = "Senior Software Engineer"
        company = "Tech Corp"
        location = "San Francisco, CA"
        jobType = "FULL_TIME"
        experienceLevel = "SENIOR"
        salary = "`$120,000 - `$180,000"
        description = "We are looking for an experienced software engineer to join our team."
        applicationUrl = "https://techcorp.com/apply"
        recruiterId = $userId2
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/jobs" -Method Post -Body $jobBody -ContentType $contentType
        $jobId1 = $response.id
        Write-Host "✓ Created job with ID: $jobId1" -ForegroundColor Green
        $response | ConvertTo-Json
    } catch {
        Write-Host "✗ Failed to create job" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# Get All Jobs
Write-Host "`nGetting All Jobs..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/jobs" -Method Get
    Write-Host "✓ Found $($response.pagination.total) job(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get jobs" -ForegroundColor Red
}

# Filter Jobs by Type
Write-Host "`nFiltering Jobs by Type (FULL_TIME)..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/jobs?jobType=FULL_TIME" -Method Get
    Write-Host "✓ Found $($response.pagination.total) full-time job(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Filter test failed" -ForegroundColor Red
}

# Get Specific Job
if ($jobId1) {
    Write-Host "`nGetting Specific Job ($jobId1)..." -ForegroundColor Green
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/jobs/$jobId1" -Method Get
        Write-Host "✓ Retrieved job: $($response.title)" -ForegroundColor Green
        Write-Host "  Applications: $($response._count.applications)"
    } catch {
        Write-Host "✗ Failed to get job" -ForegroundColor Red
    }
}

Write-Host "`n`n3. Testing Applications API" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# Create Application
if ($jobId1 -and $userId1) {
    Write-Host "`nCreating Application..." -ForegroundColor Green
    $appBody = @{
        jobId = $jobId1
        candidateId = $userId1
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/applications" -Method Post -Body $appBody -ContentType $contentType
        $applicationId1 = $response.id
        Write-Host "✓ Created application with ID: $applicationId1" -ForegroundColor Green
        $response | ConvertTo-Json
    } catch {
        Write-Host "✗ Failed to create application" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# Get All Applications
Write-Host "`nGetting All Applications..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/applications" -Method Get
    Write-Host "✓ Found $($response.pagination.total) application(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get applications" -ForegroundColor Red
}

# Update Application Status
if ($applicationId1) {
    Write-Host "`nUpdating Application Status..." -ForegroundColor Green
    $statusBody = @{
        status = "REVIEWED"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/applications/$applicationId1" -Method Patch -Body $statusBody -ContentType $contentType
        Write-Host "✓ Updated application status to: $($response.status)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to update application" -ForegroundColor Red
    }
}

Write-Host "`n`n4. Testing Error Handling" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# Test Invalid Email
Write-Host "`nTesting Invalid Email (should return 400)..." -ForegroundColor Green
$invalidBody = @{
    email = "invalid-email"
    name = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Post -Body $invalidBody -ContentType $contentType
    Write-Host "✗ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly returned error for invalid email" -ForegroundColor Green
}

# Test Non-Existent User
Write-Host "`nTesting Non-Existent User (should return 404)..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users/00000000-0000-0000-0000-000000000000" -Method Get
    Write-Host "✗ Should have failed but didn't!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✓ Correctly returned 404 for non-existent user" -ForegroundColor Green
    } else {
        Write-Host "✗ Returned wrong status code" -ForegroundColor Red
    }
}

# Test Duplicate Application
if ($jobId1 -and $userId1) {
    Write-Host "`nTesting Duplicate Application (should return 409)..." -ForegroundColor Green
    $dupBody = @{
        jobId = $jobId1
        candidateId = $userId1
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/applications" -Method Post -Body $dupBody -ContentType $contentType
        Write-Host "✗ Should have failed but didn't!" -ForegroundColor Red
    } catch {
        Write-Host "✓ Correctly prevented duplicate application" -ForegroundColor Green
    }
}

Write-Host "`n`n=== Testing Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Created Resources:" -ForegroundColor Yellow
Write-Host "  Candidate ID: $userId1"
Write-Host "  Recruiter ID: $userId2"
Write-Host "  Job ID: $jobId1"
Write-Host "  Application ID: $applicationId1"
Write-Host ""
Write-Host "You can verify data in Prisma Studio:" -ForegroundColor Cyan
Write-Host "  npx prisma studio" -ForegroundColor White
