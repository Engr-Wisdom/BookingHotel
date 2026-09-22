SELECT password
FROM users
WHERE LOWER(email) = LOWER('wisdomtest@example.com');