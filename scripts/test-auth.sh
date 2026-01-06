#!/bin/bash

# Authentication API Test Script
# This script demonstrates testing all authentication endpoints

BASE_URL="http://localhost:3000"

echo "================================"
echo "Authentication API Test Suite"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Signup with new user
echo -e "${YELLOW}Test 1: Signup with new user${NC}"
echo "POST $BASE_URL/api/auth/signup"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "securepassword123"
  }')
echo "$SIGNUP_RESPONSE" | jq '.'
echo ""

# Test 2: Signup with duplicate email (should fail)
echo -e "${YELLOW}Test 2: Signup with duplicate email (should fail)${NC}"
echo "POST $BASE_URL/api/auth/signup"
DUPLICATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Duplicate",
    "email": "alice@example.com",
    "password": "anotherpassword"
  }')
echo "$DUPLICATE_RESPONSE" | jq '.'
echo ""

# Test 3: Login with correct credentials
echo -e "${YELLOW}Test 3: Login with correct credentials${NC}"
echo "POST $BASE_URL/api/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepassword123"
  }')
echo "$LOGIN_RESPONSE" | jq '.'

# Extract token from response
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""
echo -e "${GREEN}Token extracted: $TOKEN${NC}"
echo ""

# Test 4: Login with wrong password (should fail)
echo -e "${YELLOW}Test 4: Login with wrong password (should fail)${NC}"
echo "POST $BASE_URL/api/auth/login"
WRONG_PASSWORD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "wrongpassword"
  }')
echo "$WRONG_PASSWORD_RESPONSE" | jq '.'
echo ""

# Test 5: Login with non-existent email (should fail)
echo -e "${YELLOW}Test 5: Login with non-existent email (should fail)${NC}"
echo "POST $BASE_URL/api/auth/login"
NO_USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "anypassword"
  }')
echo "$NO_USER_RESPONSE" | jq '.'
echo ""

# Test 6: Access protected route without token (should fail)
echo -e "${YELLOW}Test 6: Access protected route without token (should fail)${NC}"
echo "GET $BASE_URL/api/auth/protected"
NO_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/protected")
echo "$NO_TOKEN_RESPONSE" | jq '.'
echo ""

# Test 7: Access protected route with invalid token (should fail)
echo -e "${YELLOW}Test 7: Access protected route with invalid token (should fail)${NC}"
echo "GET $BASE_URL/api/auth/protected"
INVALID_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/protected" \
  -H "Authorization: Bearer invalid.token.here")
echo "$INVALID_TOKEN_RESPONSE" | jq '.'
echo ""

# Test 8: Access protected route with valid token (should succeed)
echo -e "${YELLOW}Test 8: Access protected route with valid token (should succeed)${NC}"
echo "GET $BASE_URL/api/auth/protected"
if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  PROTECTED_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/protected" \
    -H "Authorization: Bearer $TOKEN")
  echo "$PROTECTED_RESPONSE" | jq '.'
  echo ""
  echo -e "${GREEN}✓ Authentication flow completed successfully!${NC}"
else
  echo -e "${RED}✗ Token not available, skipping protected route test${NC}"
fi

echo ""
echo "================================"
echo "Test Suite Completed"
echo "================================"
